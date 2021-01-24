import React, { useEffect, useState } from "react";
import { History } from "./components/History";
import { Dapp } from "./components/Dapp";
import { Navigation } from "./components/Navigation";
import { Chart } from "./components/Chart";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import "./App.scss";

function App() {
  const [user, setUser] = useState("");
  //opens intial wallet via metamasks injected eth window variable
  const LoadDapp = async () => {
    console.log("loading user account...");
    setUser(
      (await (window as any).ethereum.request(
        { method: "eth_requestAccounts" },
      ))[0],
    );
    console.log("loading finished!");
  };
  // start dapp via metamask wallet
  useEffect(() => {
    LoadDapp();
  }, []);
  return (
    <Router>
      <Navigation user={user} />

      <Switch>
        <Route path={["/dashboard"]}>
          <Dapp userAddress={user} />
        </Route>
        <Route
          path="/chart"
        >
          <Chart coin="bitcoin" currency="usd" days={14} />
        </Route>
      </Switch>

      {/* <History user="0xa485b3e631c02834A73349CFA6c5543bB0796985" /> */}
    </Router>
  );
}

export default App;
