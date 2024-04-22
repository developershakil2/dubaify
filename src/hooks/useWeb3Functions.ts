import config from "../config";
import { RootState } from "../store";
import { useSelector, useDispatch } from "react-redux";
import {
  setTokenPrice,
  setTotalTokensforSale,
  setTotalTokensSold,
  setMinBuyLimit,
  setMaxBuyLimit,
} from "../store/presale";
import { useMemo, useState } from "react";
import { erc20ABI, useAccount, usePublicClient, useWalletClient } from "wagmi";
import { setBalance } from "../store/wallet";
import { toast } from "react-toastify";
import { storeReferralTransaction, storeTransaction } from "../utils/apis";
import {
  createPublicClient,
  formatUnits,
  getContract,
  http,
  parseUnits,
  zeroAddress,
} from "viem";
import { presaleAbi } from "../contracts/presaleABI";

const publicClient = createPublicClient({
  chain: config.chains[0],
  batch: { multicall: true },
  transport: http(),
});

const useWeb3Functions = () => {
  const chainId = useSelector((state: RootState) => state.presale.chainId);

  const [loading, setLoading] = useState(false);
  const tokens = useSelector((state: RootState) => state.presale.tokens);
  const dispatch = useDispatch();
  const provider = usePublicClient();
  const { data: signer } = useWalletClient();
  const { address } = useAccount();

  const presaleContract = useMemo(
    () =>
      getContract({
        address: config.presaleContract[chainId],
        abi: presaleAbi,
        publicClient,
        walletClient: signer || undefined,
      }),
    [signer, chainId]
  );

  const fetchIntialData = async () => {
    setLoading(true);

    const [totalTokensSold, totalTokensforSale] = await Promise.all([
      presaleContract.read.totalTokensSold(),
      presaleContract.read.totalTokensforSale(),
      fetchTokenPrices(),
    ]);

    dispatch(setTotalTokensSold(+format(totalTokensSold)));
    dispatch(setTotalTokensforSale(+format(totalTokensforSale)));

    setLoading(false);
  };

  const fetchMinMaxBuyLimits = async () => {
    const [minBuyLimit, maxBuyLimit] = await Promise.all([
      presaleContract.read.minBuyLimit(),
      presaleContract.read.maxBuyLimit(),
    ]);

    dispatch(setMinBuyLimit(+format(minBuyLimit)));
    dispatch(setMaxBuyLimit(+format(maxBuyLimit)));
  };

  const fetchTotalTokensSold = async () => {
    const totalTokensSold = await presaleContract.read.totalTokensSold();
    dispatch(setTotalTokensSold(+format(totalTokensSold)));

    return totalTokensSold;
  };

  const fetchLockedBalance = async () => {
    if (!address) return;

    const { symbol, decimals } = config.saleToken[chainId];
    const buyerAmount = await presaleContract.read.buyersAmount([address]);
    const balance = +formatUnits(buyerAmount[0], decimals);

    dispatch(setBalance({ symbol: symbol, balance }));

    return balance;
  };

  const fetchTokenBalances = async () => {
    if (!address) return;

    for await (const token of tokens[chainId]) {
      let balance: bigint;
      if (token.address) {
        balance = await publicClient.readContract({
          address: token.address,
          abi: erc20ABI,
          functionName: "balanceOf",
          args: [address],
        });
      } else {
        balance = await provider.getBalance({ address });
      }

      dispatch(
        setBalance({
          symbol: token.symbol,
          balance: +formatUnits(balance, token.decimals),
        })
      );
    }
  };

  const fetchTokenPrices = async () => {
    for await (const token of tokens[chainId]) {
      const rate = token.address
        ? await presaleContract.read.tokenPrices([token.address])
        : await presaleContract.read.rate();

      dispatch(
        setTokenPrice({
          symbol: token.symbol,
          price: +formatUnits(rate, token.decimals),
        })
      );
    }
  };

  const checkAllowance = async (
    token: Token,
    owner: Address,
    spender: Address
  ) => {
    if (!token.address || !signer) return;

    const allowance = await publicClient.readContract({
      address: token.address,
      abi: erc20ABI,
      functionName: "allowance",
      args: [owner, spender],
    });

    if (!Number(allowance)) {
      const hash = await signer.writeContract({
        address: token.address,
        abi: erc20ABI,
        functionName: "approve",
        args: [spender, parseUnits("9999999999999999999999999999", 18)],
      });

      await publicClient.waitForTransactionReceipt({ hash });

      toast.success("Spend approved");
    }
  };

  const buyToken = async (value: string | number, token: Token) => {
    let success = false;
    if (!address || !signer) return { success };

    setLoading(true);

    try {
      const amount = parseUnits(`${value}`, token.decimals);
      let hash;

      if (token.address) {
        await checkAllowance(token, address, config.presaleContract[chainId]);
        hash = await presaleContract.write.buyToken([token.address, amount]);
      } else {
        hash = await presaleContract.write.buyToken([zeroAddress, amount], {
          value: amount,
        });
      }

      await publicClient.waitForTransactionReceipt({ hash });

      const purchased_amount = token.address
        ? await presaleContract.read.getTokenAmount([token.address, amount])
        : await presaleContract.read.getTokenAmount([zeroAddress, amount]);

      storeTransaction({
        wallet_address: address,
        purchased_amount: +format(purchased_amount),
        paid_amount: value,
        transaction_hash: hash,
        paid_with: token.symbol,
      });

      storeReferralTransaction({
        purchased_amount: +format(purchased_amount),
        paid: value,
        transaction_hash: hash,
        payable_token: token.symbol,
      });

      fetchTokenBalances();
      fetchLockedBalance();
      fetchTotalTokensSold();

      toast.success(
        `You have successfully purchased $${config.saleToken[chainId].symbol} Tokens. Thank you!`
      );

      success = true;
    } catch (error: any) {
      console.log(error);
      if (
        error?.error?.code === -32603 &&
        error?.error?.message.includes("reverted")
      ) {
        toast.error(error.error.message?.replace("execution reverted:", ""));
      } else toast.error("Signing failed, please try again!");
    }

    setLoading(false);

    return { success };
  };

  const addTokenAsset = async (token: Token) => {
    if (!token.address || !signer) return;
    try {
      await signer.watchAsset({
        type: "ERC20",
        options: {
          address: token.address,
          symbol: token.symbol,
          decimals: token.decimals ?? 18,
          image: token.image.includes("http")
            ? token.image
            : `${window.location.origin}${token.image}`,
        },
      });
      toast.success("Token imported to metamask successfully");
    } catch (e) {
      toast.error("Token import failed");
    }
  };

  const parse = (value: string | number) =>
    parseUnits(`${value}`, config.saleToken[chainId].decimals);

  const format = (value: bigint) =>
    formatUnits(value, config.saleToken[chainId].decimals);

  return {
    loading,
    parse,
    format,
    buyToken,
    addTokenAsset,
    fetchIntialData,
    fetchLockedBalance,
    fetchTokenBalances,
    fetchMinMaxBuyLimits,
  };
};

export default useWeb3Functions;
