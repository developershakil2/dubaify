import { useEffect, useMemo, useState } from "react";
import { ReactComponent as ETHIcon } from "../assets/svg/eth.svg";
import { ReactComponent as DownArrowIcon } from "../assets/svg/down-arrow.svg";
import { ReferralModal } from "./ReferralModal";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store";
import config from "../config";
import { useWeb3Modal } from "@web3modal/react";
import { useAccount, useNetwork, useSwitchNetwork } from "wagmi";
import useWeb3Functions from "../hooks/useWeb3Functions";
import Loading from "./Loading";
import { toast } from "react-toastify";
import { setCurrentChain } from "../store/presale";
import { SelectTokenModal } from "./SelectTokenModal";

const BuyForm = () => {
  const dispatch = useDispatch();
  const { chain } = useNetwork();
  const { switchNetwork, switchNetworkAsync } = useSwitchNetwork();

  const chainId = useSelector((state: RootState) => state.presale.chainId);
  const tokens = useSelector((state: RootState) => state.presale.tokens);
  const balances = useSelector((state: RootState) => state.wallet.balances);
  const tokenPrices = useSelector((state: RootState) => state.presale.prices);
  const totalTokensSold = useSelector(
    (state: RootState) => state.presale.totalTokensSold
  );
  const totalTokensForSale = useSelector(
    (state: RootState) => state.presale.totalTokensforSale
  );
  const minBuyLimit = useSelector(
    (state: RootState) => state.presale.minBuyLimit
  );
  const maxBuyLimit = useSelector(
    (state: RootState) => state.presale.maxBuyLimit
  );
  const tokenBalance = useSelector((state: RootState) => state.wallet.balances);
  const saleToken = config.saleToken;

  const [fromToken, setFromToken] = useState<Token>(tokens[chainId][0]);
  const [toToken, setToToken] = useState<Token>(
    saleToken[chainId as ChainId] as Token
  );

  const [fromValue, setFromValue] = useState<string | number>("");
  const [toValue, setToValue] = useState<string | number>("");

  const [isReferralModalOpen, setIsReferralModalOpen] = useState(false);
  const [isSelectTokenModalOpen, setIsSelectTokenModalOpen] = useState(false);

  const {
    fetchIntialData,
    fetchLockedBalance,
    fetchTokenBalances,
    fetchMinMaxBuyLimits,
    buyToken,
    loading,
  } = useWeb3Functions();

  const { open } = useWeb3Modal();

  const { address, isConnected } = useAccount();

  const tokenPrice = useMemo(
    () => tokenPrices[config.displayPrice[chainId as ChainId]] || 1,
    [tokenPrices]
  );

  const fixedNumber = (num: number, decimals = 6) =>
    +parseFloat((+num).toFixed(decimals));

  const formatNumber = (num: number) =>
    Intl.NumberFormat().format(fixedNumber(num, 2));

  const soldPercentage = useMemo(
    () =>
      fixedNumber(
        ((totalTokensSold * tokenPrice + config.extraSoldAmount) /
          (totalTokensForSale * tokenPrice)) *
          100,
        2
      ) || 0,
    [totalTokensSold, totalTokensForSale, tokenPrice]
  );

  const lockedToken = useMemo(
    () => formatNumber(balances[toToken.symbol]),
    [balances]
  );

  const insufficientBalance = useMemo(() => {
    if (!fromValue) return false;
    return +fromValue > tokenBalance[fromToken.symbol];
  }, [fromValue, tokenBalance]);

  const fromValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (!value) {
      emptyValues();
      return;
    }

    setFromValue(fixedNumber(+value));
    if (tokenPrices[fromToken.symbol] !== 0) {
      setToValue(fixedNumber(+value / tokenPrices[fromToken.symbol], 4));
    }
  };

  const toValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (!value) {
      emptyValues();
      return;
    }

    setToValue(fixedNumber(+value, 4));
    if (tokenPrices[fromToken.symbol] !== 0) {
      setFromValue(fixedNumber(+value * tokenPrices[fromToken.symbol]));
    }
  };

  const emptyValues = () => {
    setFromValue("");
    setToValue("");
  };
  const checkIfMinMaxAmount = () => {
    if (+toValue + +lockedToken > maxBuyLimit) {
      toast.error(
        `You have reached maximum amount for ${Intl.NumberFormat().format(
          maxBuyLimit
        )} ArtiCoin`
      );
      return false;
    }

    if (+toValue < minBuyLimit) {
      toast.error(`Minimum amount is ${minBuyLimit} ARTI`);
      return false;
    }

    return true;
  };

  const submit = async (event: any) => {
    event.preventDefault();

    if (+fromToken === 0) return;
    if (!checkIfMinMaxAmount()) return;
    if (chain?.unsupported) {
      await switchNetworkAsync?.(config.chains[0].id);
    }

    try {
      await buyToken(fromValue, fromToken);
      emptyValues();
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    // if (!isPresaleStarted) return;
    if (!chain) return;
    if (chain.unsupported) switchNetwork?.(config.chains[0].id);
    dispatch(setCurrentChain(chain?.id || config.chains[0].id));
  }, [chain]);

  useEffect(() => {
    // if (!isPresaleStarted) return;
    if (!address || !chain) return;
    fetchLockedBalance();
    fetchTokenBalances();
    fetchMinMaxBuyLimits();
  }, [address, chain]);

  useEffect(() => {
    // if (!isPresaleStarted) return;
    fetchIntialData();
  }, []);

  return (
    <div className="relative mx-auto w-full max-w-lg rounded-3xl bg-[#1a2025]/70 backdrop-blur-xl">
      {loading && <Loading />}

      {!loading && (
        <div className="absolute -top-8 w-full">
          {/* <p className="mx-10 rounded-2xl border-2 border-white/10 bg-gradient-to-t from-black/20 to-transparent py-4 text-center text-2xl backdrop-blur-3xl">
            Pre-Sale <span className="font-semibold text-green-500">NOT LIVE</span> 
          </p> */}
        </div>
      )}
      <form onSubmit={submit} className="mb-6 flex flex-col gap-6 px-5 pt-16">
        <div
          className={`flex gap-4 rounded-xl border-2 border-transparent bg-[#232c3a]/50 py-2.5 pr-2.5 pl-6 ring-4 ring-transparent focus-within:border-primary/50 focus-within:ring-primary/20 ${
            insufficientBalance
              ? "!border-red-500/50 !text-red-400 !ring-red-500/20"
              : ""
          }`}
        >
          <div className="flex flex-1 flex-col gap-1">
            <label className="text-sm">You send</label>
            <input
              className="w-full bg-transparent text-xl outline-none"
              type="number"
              step={0.002}
              placeholder="0.0"
              value={fromValue}
              onChange={fromValueChange}
            />
          </div>
          <button
            type="button"
            className="flex items-center gap-2 rounded-xl bg-[#2F3B4F] py-2.5 px-4 transition-opacity duration-200 hover:opacity-75"
            onClick={() => setIsSelectTokenModalOpen(true)}
          >
            <img
              src={fromToken.image}
              alt={fromToken.symbol}
              className="h-7 w-7 object-contain"
            />
            <span>{fromToken.symbol}</span>
            <DownArrowIcon />
          </button>
        </div>
        <div className="flex items-center gap-4">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#232c3a]/50 text-3xl font-bold">
            =
          </span>
          <span className="text-white/50">$0.002 = 1 DOBI</span>
          <span className="text-white/50">$0.004 = 1 DOBI</span>
          <span className="text-white/50">$0.006 = 1 DOBI</span>
        </div>
        <div className="flex gap-4 rounded-xl border-2 border-transparent bg-[#232c3a]/50 py-2.5 pr-2.5 pl-6 ring-4 ring-transparent focus-within:border-primary/50 focus-within:ring-primary/20">
          <div className="flex flex-1 flex-col gap-1">
            <label className="text-sm">You get</label>
            <input
              type="number"
              value={toValue}
              onChange={toValueChange}
              className="w-full bg-transparent text-xl outline-none"
              placeholder="0.0"
              step={0.002}
            />
          </div>
          <button
            type="button"
            className="flex items-center gap-2 rounded-xl bg-[#2F3B4F] py-2.5 px-4 transition-opacity duration-200 hover:opacity-75"
            disabled
          >
            <img
              src={toToken.image}
              alt={toToken.symbol}
              className="h-7 w-7 object-contain"
            />

            <span>{toToken.symbol}</span>
          </button>
        </div>
        {insufficientBalance && (
          <p className="text-sm text-red-500">
            Oops! It looks like you don't have enough {fromToken.symbol} to pay
            for that transaction. Please reduce the amount of {fromToken.symbol}{" "}
            and try again.
          </p>
        )}
        <div className="-mx-5 h-0.5 bg-[#30353A]"></div>
        <div className="flex flex-col gap-2">
          <div className="flex items-end justify-between">
            <span>
              <span className="text-2xl">
                $
                {formatNumber(
                  totalTokensSold * tokenPrice + config.extraSoldAmount
                )}
                /
              </span>
              ${formatNumber(totalTokensForSale * tokenPrice)}
            </span>
            <span>{soldPercentage}%</span>
          </div>
          <div className="progress">
            <div
              className="progress-bar"
              style={{ width: `${soldPercentage}%` }}
            ></div>
          </div>
        </div>
        <p className="text-center text-sm font-medium uppercase text-[#D1D3FF]">
          {isConnected
            ? `you purchased ${lockedToken} ${toToken.symbol} TOKENS`
            : `Connect your wallet to buy ${toToken.symbol}`}
        </p>
        <div className="-mx-5 h-[2px] bg-[#30353A]"></div>
        {isConnected ? (
          <button
            className="relative flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-l from-[#00ea42] to-[#00eaac] py-4 px-6 text-lg font-semibold text-secondary transition-opacity duration-200 hover:opacity-75 disabled:cursor-not-allowed disabled:opacity-80 lg:text-xl"
            disabled={loading || insufficientBalance}
            type="submit"
          >
            {loading && (
              <svg
                aria-hidden="true"
                className="h-5 w-5 animate-spin fill-primary text-gray-200"
                viewBox="0 0 100 101"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                  fill="currentColor"
                />
                <path
                  d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                  fill="currentFill"
                />
              </svg>
            )}
            Start exchange
          </button>
        ) : (
          <button
            className="relative flex w-full animate-pulse items-center justify-center gap-2 rounded-xl  bg-gradient-to-l from-[#00ea42] to-[#00eaac] py-4 px-6 text-lg font-semibold text-secondary transition-opacity duration-200 hover:opacity-75 disabled:cursor-not-allowed disabled:opacity-80 lg:text-xl"
            disabled={loading}
            type="button"
            onClick={() => open()}
          >
            {loading && (
              <svg
                aria-hidden="true"
                className="h-5 w-5 animate-spin fill-primary text-gray-200"
                viewBox="0 0 100 101"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                  fill="currentColor"
                />
                <path
                  d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                  fill="currentFill"
                />
              </svg>
            )}
            Connect wallet
          </button>
        )}
      </form>
      {isSelectTokenModalOpen && (
        <SelectTokenModal
          closeModal={() => setIsSelectTokenModalOpen(false)}
          selectToken={(token: Token) => {
            setFromToken(token);
            setFromValue("0");
            setToValue("0");
            setIsSelectTokenModalOpen(false);
          }}
        />
      )}
      {isReferralModalOpen && (
        <ReferralModal closeModal={() => setIsReferralModalOpen(false)} />
      )}
    </div>
  );
};

export default BuyForm;
