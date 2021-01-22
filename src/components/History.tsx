import React, { useEffect } from "react";
import { ethers } from "ethers";
interface Props {
  user: string;
}

export const History: React.FC<Props> = ({ user }) => {
  useEffect(() => {
    let etherscanProvider = new ethers.providers.EtherscanProvider();
    etherscanProvider.getHistory(user).then((history) => {
      history.forEach((tx) => {
        console.log(tx);
      });
    });
  }, []);
  return (
    <div>
      History
    </div>
  );
};
