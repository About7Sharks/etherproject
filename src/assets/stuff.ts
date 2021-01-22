import { ethers } from "ethers";

export const abi = [
  "function balanceOf(address owner) view returns (uint256)",
  "function decimals() view returns (uint8)",
  "function symbol() view returns (string)",
  "function getCurrentTokens() view returns (address[])",
];

//etherscan.io api key
export const apikey = process.env.REACT_APP_ETHERSCAN;
export let provider = new ethers.providers.Web3Provider(
  (window as any).ethereum,
);
