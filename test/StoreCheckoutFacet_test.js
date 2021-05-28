require('dotenv').config()

const CentralMarket      = artifacts.require("./CentralMarket.sol");
const FinanceDiamond     = artifacts.require('FinanceDiamond');
const FoodTokenFacet     = artifacts.require('FoodTokenFacet');
const StoreCheckoutFacet = artifacts.require("./StoreCheckoutFacet.sol");


const FoodToken = artifacts.require("./FoodToken.sol");

const {BN, constants, expectEvent, expectRevert} = require('@openzeppelin/test-helpers');
const { assert, util } = require('chai');
const node_util = require('util')

contract('StoreCheckoutFacet', ([member1, member2]) => {
    let centralMarket, financeDiamond, foodTokenFacet, storeCheckoutFacet;

    before(async () => {
        centralMarket  = await CentralMarket.deployed();
        financeDiamond = await FinanceDiamond.deployed();
        foodTokenFacet     = new web3.eth.Contract(FoodTokenFacet.abi, financeDiamond.address);
        storeCheckoutFacet = new web3.eth.Contract(StoreCheckoutFacet.abi, financeDiamond.address);
      });   

    it('#checkout', async function(){
        
        let amount_due = 2;
        let mint_amount = 100;
        await foodTokenFacet.methods.mint(member1, mint_amount).send({from: member1});
        
        let customer_balance_starting = await foodTokenFacet.methods.balanceOf(member1).call();
        let market_balance_starting   = await foodTokenFacet.methods.balanceOf(centralMarket.address).call();
        
        await storeCheckoutFacet.methods.checkout(centralMarket.address, amount_due).send({from: member1});

        let customer_balance_after_checkout = await foodTokenFacet.methods.balanceOf(member1).call();
        let market_balance_after_checkout   = await foodTokenFacet.methods.balanceOf(centralMarket.address).call();
        
        let customer_diff = Math.abs(customer_balance_starting - customer_balance_after_checkout)
        let market_diff   = Math.abs(market_balance_starting - market_balance_after_checkout)

        assert.equal(customer_diff, amount_due);
        assert.equal(market_diff, amount_due);
    });





})