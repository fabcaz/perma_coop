import React, { Component } from 'react'
import Web3 from 'web3'
//const {BN, constants, expectEvent, expectRevert} = require('@openzeppelin/test-helpers');


import CentralMarket from '../build/contracts/CentralMarket.json'


import Navigbar from './Navigbar.js'
import InventoryTable from './InventoryTable.js'






class App extends Component {
  

    async UNSAFE_componentWillMount() {
      await this.loadWeb3();
      await this.loadBlockchainData();
    }

    async loadBlockchainData(){
        const web3 = window.web3;
        const util = require('util')

        const accounts = await web3.eth.getAccounts();
        console.log("web3.eth.getAccounts IS "+accounts);
        this.setState({ account: accounts[0] });
        console.log("ACCOUNT IS "+this.state.account);

        const networkId = await web3.eth.net.getId();
        const networkData = CentralMarket.networks[networkId]

        //console.log("networkId: "+ networkId+"\nJJJ");

        //console.log("CentralMarket: "+ util.inspect(CentralMarket)+"\nJJJ");
        // console.log("CentralMarket.networks: "+ util.inspect(CentralMarket.networks)+"\nJJJ");
        // console.log("networkData: "+ util.inspect(networkData)+"\nJJJ");
        
        //use networkData to get abi and create contract objs
        if(networkData){
          console.log("GGGGGGGGGGg 1")
          const centralMarket = new web3.eth.Contract(CentralMarket.abi, networkData.address);
          this.setState({centralMarket});
          
          console.log("GGGGGGGGGGg 2")

          /**
           * MUST CREATE PRODUCTS TROUGH TRUFFLE CONSOLE
           */

          let fetchedManifest = this.getInventoryManifest_as_2d_array();
          //console.log("fetchedManifest: "+ util.inspect(fetchedManifest)+"\nJJJ");

          // this.setState({
          //   marketInventory: fetchedManifest
          // })
          // this.setState({marketInventory: [
          //   ['0x706f7461746f0000000000000000000000000000000000000000000000000000', '0x746f6d61746f0000000000000000000000000000000000000000000000000000', '0x7261646973680000000000000000000000000000000000000000000000000000'],
          //   [5, 6, 7],
          //   [1000, 2000, 3000]
          // ]})
          console.log("GGGGGGGGGGg4")
          console.log("\n\n\n\n");
          console.log("L73 this.state.marketInventory: "+util.inspect(this.state.marketInventory));
        }

        //get inventory form Market Contract
    }

    // connect to web3
    async loadWeb3() {
        if (window.ethereum) {
          window.web3 = new Web3(window.ethereum);
          await window.ethereum.enable();
          console.log("window.ethereum");
        }
        else if (window.web3) {
          window.web3 = new Web3(window.web3.currentProvider);
          console.log("window.web3");
        }
        else {
          window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!');
        }
      }

      constructor(props){
        super(props);
        this.state = {
            loading: true,
            showCart: false,
            marketInventory: [],
            cart: [],
            account: '',
            centralMarket: null,
        };

        this.createProductLiteral = this.createProductLiteral.bind(this);
        this.getInventoryManifest_as_2d_array = this.getInventoryManifest_as_2d_array.bind(this);
      }

      async getInventoryManifest(){
        //get every item in CentralMarket.products_mapping
        //for every item:
        //  1. create object literal
        //  2. push obj literal in this.state.products (using setState()) | push into new array which will later be pushed to state var to only re-render once 
        this.setState({ loading: true });
        let productList = await this.state.centralMarket.methods.getInventoryManifest().call();
        let inventoryTmp = [];

        productList.array.forEach(prod => {
          inventoryTmp.push(
            this.createProductLiteral(prod)
            )
        });

        this.setState({ marketInventory: inventoryTmp });

        //reconstructing objects may not be necessary to display data since orders are writen on chain  at checkout

      }

      async getInventoryManifest_as_2d_array(){
        //get every item in CentralMarket.products_mapping
        //create table directly from returned 2d array
        //note: processing maybe be required as returned values should be BN
        this.setState({ loading: true });
        let productList = await this.state.centralMarket.methods.getInventoryManifest().call();

        this.setState({ marketInventory: productList }); 
      }

      /**
       * Converts a tuple representing a Product struct instance from CentralMarket.sol into an object literal
       * @param {array} productTuple - array of destructured product object
       * @returns array argument as an object literal
       */
      createProductLiteral(productTuple){
        return {
                name: productTuple[0] ,
                price: productTuple[1],
                qty: productTuple[2]
              };
      }

      // does not put a hold on the product because it would be expensive
      putInCart(){
        //reduce inventory on screen but not on chain
        //add product to cart
        //
      }

      removeFromCart(){
          //
      }


      async checkout(){
        //check that there is sufficient inventory
        //remove inventory
        //transfer funds
      }

      

      render(){
        console.debug("\n===RENDERING start===\n");
        console.debug("marketInv: "+this.state.marketInventory);
        console.debug("accounts: "+this.state.account);
        console.debug("\n===RENDERING end===\n");
          
          return(
            <div>
              <Navigbar account={this.state.account}/>
              { <InventoryTable header={['name', 'price', 'quantity', 'lasfd']}
                marketInventory={this.state.marketInventory} /> }
            </div>
          )

          
          
      }

}


export default App;