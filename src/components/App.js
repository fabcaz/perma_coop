import React, { Component } from 'react'
import Web3 from 'web3'
//const {BN, constants, expectEvent, expectRevert} = require('@openzeppelin/test-helpers');


import CentralMarket from '../build/contracts/CentralMarket.json'


import Navigbar from './Navigbar.js'
import InventoryTable from './InventoryTable.js'
import assert from 'assert';


const util = require('util')



class App extends Component {
  

    async UNSAFE_componentWillMount() {
      await this.loadWeb3();
      await this.loadBlockchainData();
    }

    constructor(props){
      super(props);
      this.state = {
          loading: true,
          showCart: false,
          //should decompose market inv into multiple arrays to avoid copying entire manifest for one value
          marketInventory: [],
          //Map<idx, cartEntryJSONObj>
          cart: new Map(),
          account: '',
          centralMarket: null,
      };

      this.createProductJSONObj = this.createProductJSONObj.bind(this);
      this.getInventoryManifest_as_2d_array = this.getInventoryManifest_as_2d_array.bind(this);
      this.updateCartEntry = this.updateCartEntry.bind(this);
      this.updateCartEntryQty = this.updateCartEntryQty.bind(this);
      this.getProductNameByIdx = this.getProductNameByIdx.bind(this);
      this.getProductQtyByIdx = this.getProductQtyByIdx.bind(this);
      this.getProductPriceByIdx = this.getProductPriceByIdx.bind(this);
      this.createCartEntryJSONObj = this.createCartEntryJSONObj.bind(this);
    }

    async loadBlockchainData(){
        const web3 = window.web3;
        
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
          //console.log("GGGGGGGGGGg 1")
          const centralMarket = new web3.eth.Contract(CentralMarket.abi, networkData.address);
          this.setState({centralMarket});
          
          //console.log("GGGGGGGGGGg 2")

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
          //console.log("GGGGGGGGGGg4")
          console.log("\n\n\n\n");
          console.log("L73 this.state.marketInventory: "+util.inspect(this.state.marketInventory));
        }
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

      

      /**
       * Gets inventory from CentralMarket smart contract and converts the
       * received 2d array containing inventory info into list of json objects.
       * `this.state.marketInventory` is set to the list of json objects
       */
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
            this.createProductJSONObj(prod)
            )
        });

        this.setState({ marketInventory: inventoryTmp });
      }

      /**
       * Gets inventory from CentralMarket smart contract. `this.state.marketInventory` is set to
       * the received 2d array containing inventory info.
       */
      async getInventoryManifest_as_2d_array(){
        //get every item in CentralMarket.products_mapping
        //create table directly from returned 2d array
        this.setState({ loading: true });
        let productList = await this.state.centralMarket.methods.getInventoryManifest().call();

        this.setState({ marketInventory: productList }); 
      }

      /**
       * Converts a tuple representing a Product struct instance from CentralMarket.sol into an object literal
       * @param {array} productTuple - array of destructured product object
       * @returns array argument as an object literal
       */
      createProductJSONObj(productTuple){
        return {
                name: productTuple[0] ,
                price: productTuple[1],
                qty: productTuple[2]
              };
      }

      createCartEntryJSONObj(name, qty, subtotal){
        return {
          //storing name here is redundant. If it does not make rendering 
          //Cart contents easier the `name` field should be disacarded in favor
          //of using getProductNamebyIdx() when rendering
                name: name,
                qty: qty,
                subtotal: subtotal
              };
      }

      getProductNameByIdx(prod_idx){
        return this.state.marketInventory[0][prod_idx];
      }

      getProductQtyByIdx(prod_idx){
        return this.state.marketInventory[2][prod_idx];
      }

      getProductPriceByIdx(prod_idx){
        return this.state.marketInventory[1][prod_idx];
      }

      
      getProductFieldByIdx(field, prod_idx){
        let field_idx;
        if (field == "name"){
          field_idx = 0;
        }else if(field == "price"){
          field_idx = 1;
        }else if(field == "qty"){
          field_idx = 2;
        }
        return this.state.marketInventory[field_idx][prod_idx];
      }

      //make version of this method that does not set state to batch updates (or takes map<idx, new_val>)
      setProductNamebyIdx(prod_idx, new_value){
        let curr_inv = JSON.parse(JSON.stringify(this.state.marketInventory))
        curr_inv[0][prod_idx] = new_value;
        this.setState(
          {marketInventory: curr_inv}
        );
      }

      setProductQtybyIdx(prod_idx, new_value){
        let curr_inv = JSON.parse(JSON.stringify(this.state.marketInventory))
        curr_inv[2][prod_idx] = new_value;
        this.setState(
          {marketInventory: curr_inv}
        );
      }


      setProductPricebyIdx(prod_idx, new_value){
        let curr_inv = JSON.parse(JSON.stringify(this.state.marketInventory))
        curr_inv[1][prod_idx] = new_value;
        this.setState(
          {marketInventory: curr_inv}
        );
      }
      
      updateCartEntry(prod_idx, new_cart_obj){
        // console.log("IDX: "+util.inspect(prod_idx))
        // console.log("NEW_CART_OBJ: "+util.inspect(new_cart_obj))

        let curr_cart = new Map(this.state.cart);
        curr_cart.set( prod_idx, new_cart_obj)
                //  .forEach((k,v) => console.log("entry is: "+util.inspect(k)+"::"+v));

        this.setState({  cart: curr_cart });
      }

      

      // does not put a hold on the product because it would be expensive
      // does not delete entries with qty=0
      /**
       * Creates an entry in the cart or updates an existing entry's qty. Quantities in
       * cart are not taken out of the contract's inventory until checkout.
       * @param {number} prod_idx - index of product row in `this.state.marketInventory`
       * @param {number} new_prod_qty_in_cart - new quantity to put in cart; the previous
       * quantity is replaced.
       * @returns array argument as an object literal
       */
      updateCartEntryQty(prod_idx, new_prod_qty_in_cart){
        //reduce inventory on screen but not on chain
        //add/change product qty in cart; change qty on shelf accordingly
        //(re)calculate current subtotal for product in question
        

        let prod_price = this.getProductPriceByIdx(prod_idx);
        //console.log("THE prod_price: "+ prod_price);

        let new_subtotal = prod_price * new_prod_qty_in_cart;
        //console.log("THE new_subtotal: "+ new_subtotal);
        
        let starting_qty_on_shelf = this.getProductQtyByIdx(prod_idx);
        //console.log("THE curr_qty_on_shelf: "+ starting_qty_on_shelf);

        if(this.state.cart.has(prod_idx)){
          console.log("@@@ EXISTING ENTRY IN CART start @@@");
          let curr_cart_entry = this.state.cart.get(prod_idx);
          //console.log("THE curr_cart_entry: "+ util.inspect(curr_cart_entry));

          //get values to put old qty back on shelf and take new qty off
          let old_qty_in_cart = curr_cart_entry["qty"];
          //console.log("THE old_qty_in_cart: "+ old_qty_in_cart);
          
          let new_qty_on_shelf = starting_qty_on_shelf + (old_qty_in_cart - new_prod_qty_in_cart);
          //console.log("THE new_qty_on_shelf: "+ new_qty_on_shelf);

          // update qty on shelf
          this.setProductQtybyIdx(prod_idx, new_qty_on_shelf);

          curr_cart_entry["qty"] = new_prod_qty_in_cart;
          curr_cart_entry["subtotal"] = new_subtotal;
          this.updateCartEntry(prod_idx, curr_cart_entry);

          console.log("@@@ EXISTING ENTRY IN CART end @@@");

        }else{
          console.log("@@@ NO EXISTING ENTRY IN CART start @@@");
          let prod_name = this.getProductNameByIdx(prod_idx);
          //console.log("THE prod_name: "+ prod_name);
          let new_cart_obj = this.createCartEntryJSONObj(prod_name, new_prod_qty_in_cart, new_subtotal);
          //console.log("THE new_cart_obj: "+ util.inspect(new_cart_obj));

          this.updateCartEntry(prod_idx, new_cart_obj);

          let new_qty_on_shelf = starting_qty_on_shelf - new_prod_qty_in_cart;
          //console.log("THE new_qty_on_shelf: "+ new_qty_on_shelf);
          this.setProductQtybyIdx(prod_idx, new_qty_on_shelf);

          console.log("@@@ NO EXISTING ENTRY IN CART end @@@");
        }

        console.log("CCCAAARRRTTT: "+util.inspect(this.state.cart))

        try {
          //shouldn't be needed since min and max are set on input elements
          let is_positive = (this.getProductQtyByIdx(prod_idx) >= 0);          
          assert(is_positive, "Not enough inventory");

        } catch (error) {
          //putting qty back on shelf; revert
          this.setProductQtybyIdx(prod_idx, starting_qty_on_shelf);
        }
      }

      
      //helper to put as onClick for button in DropdownButton
      removeFromCart(prod_idx){
        this.updateCartEntryQty(prod_idx, 0);
      }


      async checkout(){
        //check that there is sufficient inventory
        //remove inventory
        //transfer funds
      }

      

      render(){
        console.debug("\n===RENDERING start===\n");
        // console.debug("marketInv: "+util.inspect(this.state.marketInventory));
        // console.debug("accounts: "+this.state.account);
        console.debug("\n===RENDERING end===\n");
          

        //also pass this.props.updateCartEntry to Cart popup (which should be passed to NavigBar)
          return(
            <React.Fragment>
              <Navigbar account={this.state.account}/>
              <InventoryTable
                header={['name', 'price', 'quantity on shelf', 'quantity in cart']}
                marketInventory={this.state.marketInventory}
                updateCartEntry_func={this.updateCartEntryQty}
              />
            </React.Fragment>
          )
      }
}


export default App;