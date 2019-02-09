import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

import { initAccessContext } from 'eos-transit';
import scatter from 'eos-transit-scatter-provider';
import oreid from 'eos-transit-oreid-provider';

class App extends Component {
  componentDidMount() {
    const accessContext = initAccessContext({
      appName: 'OreID',
      network: {
        host: 'api.eosnewyork.io',
        port: 443,
        protocol: 'https',
        chainId: 'aca376f206b8fc25a6ed44dbdc66547c36c6c33e3a119ffbeaef943642f0e906'
      },
      walletProviders: [
        oreid({
          apiKey: '137186280e4841f5eb5968c946ec1d55912400827',
          oreIdUrl: 'https://staging.oreid.io',
          authCallback: 'http://localhost:3000/authcallback',
          signCallback: 'http://localhost:3000/signcallback',
          backgroundColor: '#F00'
        }),
        scatter()
      ]
    });

    const walletProviders = accessContext.getWalletProviders();

    const selectedProvider = walletProviders[0];
    console.log("selectedProvider:", selectedProvider);

    const wallet = accessContext.initWallet(selectedProvider);
    console.log("Init Wallet:", wallet);

    (async () => {
      console.log("Connecting...");
      await wallet.connect();
      console.log("Connected:", wallet.connected, wallet);

      /*
      console.log("Logging in...");
      await wallet.login('facebook');
      console.log("Logged in:", wallet);
      */

      // wallet.authenticated === true
      // wallet.auth === { accountName: 'some_user', permission: 'active', publicKey: '...' }
      // wallet.accountInfo === { name: 'some_user', core_liquid_balance: ..., ram_quota: ..., etc... }
    })()
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Edit <code>src/App.js</code> and save to reload.
          </p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
        </header>
      </div>
    );
  }
}

export default App;
