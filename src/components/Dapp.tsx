import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import { abi, provider } from "../assets/stuff";
import { Table } from "antd";
import {
  getCurrentEthPrice,
  getErc20Histroy,
  getTokenPrice,
} from "../assets/web3";

interface infoProp {
  balance: string;
  currentEthPrice: string;
  erc20TokenHistory: any;
  token: any;
}
interface Props {
  userAddress: string;
}
export const Dapp: React.FC<Props> = ({
  userAddress = "",
  ...props
}) => { //userAddress wallet id
  const [info, setInfo] = useState<infoProp>();
  console.log(process.env.REACT_APP_ETHERSCAN);
  //sets userAddress info (in own function to utilize async)
  const getInfo = async () => {
    //Get a list of "ERC20 - Token Transfer Events" by Address
    let tokenHistroy = await getErc20Histroy(userAddress);
    // create an unique address array from token transfer event history
    let uniqueAddress = [];
    const addrMap = new Map();
    for (const item of tokenHistroy.result) {
      if (!addrMap.has(item.contractAddress)) {
        addrMap.set(item.contractAddress, true); // set any value to Map
        uniqueAddress.push(item);
      }
    }
    console.log(
      `This address has interacted with ${uniqueAddress.length} different erc20 token contract address`,
    );

    let dog = uniqueAddress.map(async (items: any, i) => {
      //contect to that tokens contract address, since these are erc20 tokens the follow a standard and have a method of balanceOf that accepcts an address
      let contract = await new ethers.Contract(
        items.contractAddress,
        abi,
        provider,
      );
      //   try {
      //     console.log(await contract.getCurrentTokens());
      //   } catch (e) {
      //     console.log("does not exist");
      //   }
      //format token balance from wei
      let currentValue = await ethers.utils.formatEther(
        await contract.balanceOf(userAddress),
      );
      let price = await getTokenPrice(items.contractAddress);
      return {
        token: items.tokenSymbol,
        balance: currentValue,
        price: price,
        contract: items.contractAddress,
      };
    });

    //update state info
    setInfo({
      currentEthPrice: await getCurrentEthPrice(),
      //contverts wei to eth
      balance: ethers.utils.formatEther(
        await provider.getBalance(userAddress),
      ),
      //grabs all erc20 token transactions from address
      erc20TokenHistory: tokenHistroy,
      // returns promises after the settle (defined above)
      token: (await Promise.allSettled(dog)).map((item: any) => item.value)
        .filter((item: any) => {
          //this filter removes tokens the userAddress isnt using
          //and also removes tokens that dont have a getBalance ABI contract method
          if (item.balance === "0.0") return;
          if (item.price === "0.0") {
            console.log(item);
            return;
          }
          return item;
        }),
    });
  };

  //if userAddress variable updates and is defined get info
  useEffect(() => {
    console.log("userAddress updated");
    userAddress != "" ? getInfo() : console.log("no userAddress to get yet");
  }, [userAddress]);

  return (
    <div className="dapp">
      {info?.balance
        ? <Table
          pagination={false}
          title={(e) => {
            console.log(e);
            let totalTokenAssets = e.reduce(
              (acc, token) => acc + (token.price * token.balance),
              0,
            ).toFixed(2);
            console.log(totalTokenAssets);
            return <h2>Wallet: ${totalTokenAssets}</h2>;
          }}
          dataSource={[
            {
              price: info.currentEthPrice,
              balance: info.balance,
              token: "ETH",
            },
            ...info.token,
          ]}
          columns={[
            {
              title: "Token",
              dataIndex: "token",
              key: "token",
              render: (i, token) => {
                if (token.contract === undefined) {
                  token.contract = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2";
                }
                return <span>
                  <img
                    alt={token.token}
                    src={`https://github.com/trustwallet/assets/raw/master/blockchains/ethereum/assets/${
                      ethers.utils.getAddress(token.contract)
                    }/logo.png`}
                  />
                  {token.token}
                </span>;
              },
            },
            {
              title: "Balance",
              dataIndex: "balance",
              key: "balance",
              render: (balance) => ((balance * 1).toFixed(4)),
              sorter: {
                compare: (a, b) => a.balance - b.balance,
              },
            },
            {
              title: "Price",
              dataIndex: "price",
              key: "price",
              responsive: ["sm"],
              render: (price) => {
                return `$${(price * 1).toFixed(2)}`;
              },
              sorter: {
                compare: (a, b) => a.price - b.price,
              },
            },
            {
              title: "Value",
              dataIndex: "price",
              key: "value",
              render: (balance, i) => {
                return `$${(i.balance * i.price).toFixed(2)}`;
              },
              sorter: {
                compare: (a, b) =>
                  (a.balance * a.price) - (b.balance * b.price),
              },
            },
          ]}
        />
        : "No Avaliable balance"}
    </div>
  );
};
