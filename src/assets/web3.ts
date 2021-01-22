export const getTokenPrice = async (contractAddress: string) => {
  try {
    return (await (await fetch(
      `https://api.coingecko.com/api/v3/simple/token_price/ethereum?contract_addresses=${contractAddress}&vs_currencies=usd`,
    )).json())[contractAddress]["usd"];
  } catch (e) {
    console.log(e);
    return "0.0";
  }
};

//returns current etherum price in usd
export const getCurrentEthPrice = async () => {
  return (await (await fetch(
    "https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd",
  )).json()).ethereum.usd;
};
export const getErc20Histroy = async (user: string) => {
  console.log(
    `https://api.etherscan.io/api?module=account&action=tokentx&address=${user}&startblock=0&endblock=999999999&sort=asc&apikey=${process.env.REACT_APP_ETHERSCAN}`,
  );
  try {
    return await (await fetch(
      `https://api.etherscan.io/api?module=account&action=tokentx&address=${user}&startblock=0&endblock=999999999&sort=asc&apikey=${process.env.REACT_APP_ETHERSCAN}`,
    )).json();
  } catch (e) {
    console.log(e);
  }
};

export const getContractAbi = async (contractAddress: string) => {
  return await (await fetch(
    `https://api.etherscan.io/api?module=contract&action=getabi&address=${contractAddress}&apikey=${process.env.REACT_APP_ETHERSCAN}`,
  )).json();
};
