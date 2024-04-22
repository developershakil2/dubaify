import { bsc, bscTestnet, mainnet } from "wagmi/chains";

const config = {
  chains: [bsc],
  presaleStartTime: 1680912000,
  presaleContract: {
    [bscTestnet.id]: "0x9eBEed42B3989D76848f9b3E92a1ce8F156959B9",
    [bsc.id]: "0x9eBEed42B3989D76848f9b3E92a1ce8F156959B9",
    [mainnet.id]: "0x9eBEed42B3989D76848f9b3E92a1ce8F156959B9",
  } as { [key: number]: Address }, // presale contract address

  saleToken: {
    [bscTestnet.id]: {
      address: "0x5d21e6b8601fa58d61c64902c2046cdd90cd5a69", // your token address
      symbol: "DOBI", // your token symbol
      name: "DobiFy", // your token name
      image: "/img/tokens/logo.svg", // your token image
      decimals:18, // your token decimals
    },
    [bsc.id]: {
      address: "0x5d21e6b8601fa58d61c64902c2046cdd90cd5a69", // your token address
      symbol: "DOBI", // your token symbol
      name: "DobiFy", // your token name
      image: "/img/tokens/logo.svg", // your token image
      decimals:18, // your token decimals
    },
    [mainnet.id]: {
      address: "0x5d21e6b8601fa58d61c64902c2046cdd90cd5a69", // token address
      symbol: "DOBI", // token symbol
      name: "DobiFy", // token name
      image: "/img/tokens/logo.svg", // token image
      decimals:18, // token decimals
    },
  } as { [key: number]: Token },

  displayPrice: {
    [bscTestnet.id]: "USDT",
    [bsc.id]: "USDT",
    [mainnet.id]: "USDT",
  } as { [key: number]: string },

  extraSoldAmount: 0, // How much additionally you want to show as sold?

  whitelistedTokens: {
    [bscTestnet.id]: [
      {
        address: null,
        symbol: "ETH",
        name: "ETH",
        image: "/img/tokens/eth.svg",
        decimals: 18,
      },
      {
        address: "0x7a7B1e43765a5BaC58e73f3c67CcB5548AC08408",
        symbol: "USDT",
        name: "Tether USD",
        image: "/img/tokens/eth.svg",
        decimals: 6,
      },
    ],
    [bsc.id]: [
      {
        address: null,
        symbol: "BNB",
        name: "Binance Token",
        image: "/img/tokens/bnb.webp",
        decimals: 18,
      },
    
      {
        address: "0x55d398326f99059fF775485246999027B3197955",
        symbol: "USDT",
        name: "Binance-Peg USD",
        image: "/img/tokens/usdt.webp",
        decimals: 18,
      },
      {
        address: "0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56",
        symbol: "BUSD",
        name: "Binance-Peg BUSD Token",
        image: "/img/tokens/busd.webp",
        decimals: 18,
      },
      {
        address: "0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d",
        symbol: "USDC",
        name: "Binance-Peg USD Coin",
        image: "/img/tokens/usdc.webp",
        decimals: 18,
      },
    ],

    [mainnet.id]: [
      {
        address: null,
        symbol: "ETH",
        name: "ETH",
        image: "/img/tokens/eth.svg",
        decimals: 18,
      },
      {
        address: "0xdAC17F958D2ee523a2206206994597C13D831ec7",
        symbol: "USDT",
        name: "Tether USD",
        image: "/img/tokens/tethernew_32.webp",
        decimals: 6,
      },
    ],
  } as { [key: number]: Token[] },
};

export default config;
