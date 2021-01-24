import React, { useState } from "react";
import { Menu, Modal } from "antd";
import {
  DashboardOutlined,
  GithubOutlined,
  LineChartOutlined,
} from "@ant-design/icons";
import { Button } from "antd";
import { WalletOutlined } from "@ant-design/icons";
import EtherscanLogo from "../assets/etherscan-logo-circle.svg";
import { Link } from "react-router-dom";
const { SubMenu } = Menu;

interface Props {
  user?: string;
}

export const Navigation: React.FC<Props> = ({
  user = "",
  ...props
}) => {
  const [current, setCurrent] = useState("dashboard");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const handleClick = (e: any) => {
    console.log("click ", e);
    setCurrent(e.key);
  };

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };
  return (
    <div className="navbar">
      <Menu onClick={handleClick} selectedKeys={[current]} mode="horizontal">
        <Menu.Item key="dashboard" icon={<DashboardOutlined />}>
          <Link to="/dashboard">Dashboard</Link>
        </Menu.Item>
        <Menu.Item key="chart" icon={<LineChartOutlined />}>
          <Link to="/chart">Chart</Link>
        </Menu.Item>
      </Menu>
      <Button
        onClick={showModal}
        shape="round"
        type="primary"
        icon={<WalletOutlined />}
      >
        {user.substring(0, 4) + "..." +
          user.substring(user.length - 3, user.length)}
      </Button>
      <Modal
        title={"Account: " + user}
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Button
          //icon={>}
          onClick={() => {
            window.open(`https://etherscan.io/address/${user}`);
          }}
        >
          <img src={EtherscanLogo} />
          View On Etherscan
        </Button>
        <br />
        <Button
          onClick={() => {
            window.open("https://github.com/About7Sharks/etherproject");
          }}
        >
          <GithubOutlined />
          View On Github
        </Button>
        <br />

        <p>More Coming Soon...</p>
      </Modal>
    </div>
  );
};
