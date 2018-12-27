import React, { Component } from "react";
import Volunteer from "./contracts/Volunteer.json";
import getWeb3 from "./utils/getWeb3";
import { Spin } from 'antd'

import "./App.css";
import Router from "./Router/Router.js";
import AppContext from "./AppContext.js";

class App extends Component {
  state = { storageValue: 0, web3: null, accounts: null, contract: null };

  componentDidMount = async () => {
    try {
      
      const web3 = await getWeb3();
      const accounts = await web3.eth.getAccounts();
      
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = Volunteer.networks[networkId];
      const instance = new web3.eth.Contract(
        Volunteer.abi,
        deployedNetwork && deployedNetwork.address,
      );

      
      this.setState({ web3, accounts, contract: instance });
    } catch (error) {
     
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };

  render() {
    if (!this.state.contract) {
      return (
        <div style={{
          display: 'flex',
          flex: 1,
          minHeight: '100vh',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <Spin size="large" />
        </div>
      )
    }
    return (
      <AppContext.Provider value={this.state}>
        <Router />;
      </AppContext.Provider>
    )
  }
}

export default App;
