import React, { Component } from "react";
import Volunteer from "./contracts/Volunteer.json";
import getWeb3 from "./utils/getWeb3";
import { Spin } from 'antd'

import "./App.css";
import Router from "./Router/Router.js";
import { graphql } from "react-apollo";
import { CLIENT_STORE_CONTRACT } from "./apollo/global/mutations/clientStoreContract.js";
import AppContext from "./AppContext.js";

class App extends Component {
  state = { storageValue: 0, web3: null, accounts: null, contract: null };

  componentDidMount = async () => {
    try {
      
      const web3 = await getWeb3();
<<<<<<< Updated upstream
      const accounts = await web3.eth.getAccounts();
=======

     
      const accounts = await web3.eth.getAccounts();

>>>>>>> Stashed changes
      
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
<<<<<<< Updated upstream
    if (!this.state.contract) return <Spin size="large" />
=======
    // if (!this.state.web3) {
    //   return <div>Loading Web3, accounts, and contract...</div>;
    // }
>>>>>>> Stashed changes
    return (
      <AppContext.Provider value={this.state}>
        <Router />;
      </AppContext.Provider>
    )
  }
}

export default graphql(CLIENT_STORE_CONTRACT, { name: 'clientStoreContract' })(App);
