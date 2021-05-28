require('dotenv').config()

const FoodToken = artifacts.require("./FoodToken.sol");
const CentralMarket = artifacts.require("./CentralMarket.sol");
const CentralReserve = artifacts.require("./CentralReserve.sol");
const Crop = artifacts.require("./Crop.sol");

const {BN, constants, expectEvent, expectRevert} = require('@openzeppelin/test-helpers');
const { assert, util } = require('chai');
const node_util = require('util')

contract('CentralMarket', ([member1, member2]) => {
    let centralMark, crop_contract;
    
    let fake_address1 = "0x7ff3ABE1D5eAE33030eb4371bdd492a8dc5F1a76"

    // await depppp.deploy(FoodToken, TOKEN_QTY);
    //const foodToken = await FoodToken.deployed();

    // await depppp.deploy(CentralReserve, foodToken.address);

    //console.log(node_util.inspect(centralMark));

    beforeEach(async function(){
        const centralReserve = await CentralReserve.deployed();
        //console.log(node_util.inspect(centralReserve));
    
        centralMark = await CentralMarket.new();
        //centralMark = await CentralMarket.new(centralReserve.address); // contracts will not contain sample data from migrations/sample_product_data.centralReserve
        //console.log(node_util.inspect(centralMark));
        crop_contract = await Crop.new();
        console.log("&&&&&& BEFORE Market &&&&&\n\n");
        //console.log("&&&&&& BEFORE start &&&&&\n\n");
        //console.log(centralReg);
        //console.log("&&&&&& BEFORE done &&&&&&");
    });    

    it('#addCropEntry', async function(){

        let potato_name = web3.utils.asciiToHex("potato");

        let receipt = await centralMark.addCropEntry(potato_name, 5, 1000);
        //console.log(receipt.logs);
        let potatoExists = await centralMark.cropExists(potato_name);
        //console.log(potatoExists);
        assert(potatoExists);
    });

    it('#cropExists -- case: array empty', async function(){

        let potato_name = web3.utils.asciiToHex("potato");
        let potatoExists = await centralMark.cropExists(potato_name);
        //console.log(potatoExists);
        assert(!potatoExists);        
    });

    it('#updateCropPrice', async function(){

        let potato_name = web3.utils.asciiToHex("potato");

        let add_entry_receipt = await centralMark.addCropEntry(potato_name, 5, 1000);
        //console.log(receipt.logs);
        let potatoExists = await centralMark.cropExists(potato_name);
        //console.log(potatoExists);
        assert(potatoExists);

        let cropPrice = await centralMark.getCropPrice(potato_name);
        assert.equal(cropPrice, 5);

        let update_entry_receipt = await centralMark.updateCropPrice(potato_name, 50);
        
        cropPrice = await centralMark.getCropPrice(potato_name);
        assert.equal(cropPrice, 50);
    });

    it('#updateCropQty', async function(){

        let potato_name = web3.utils.asciiToHex("potato");

        let add_entry_receipt = await centralMark.addCropEntry(potato_name, 5, 1000);
        
        let potatoExists = await centralMark.cropExists(potato_name);
        
        assert(potatoExists);

        let cropPrice = await centralMark.getCropQty(potato_name);
        assert.equal(cropPrice, 1000);

        let update_entry_receipt = await centralMark.updateCropQty(potato_name, 2000);
        
        cropPrice = await centralMark.getCropQty(potato_name);
        assert.equal(cropPrice, 2000);
    });

    it('#getInventoryManifest', async function(){

        let potato_name = web3.utils.asciiToHex("potato");
        let tomato_name = web3.utils.asciiToHex("tomato");
        let radish_name = web3.utils.asciiToHex("radish");

        let add_potato_receipt = await centralMark.addCropEntry(potato_name, 5, 1000);
        let add_tomato_receipt = await centralMark.addCropEntry(tomato_name, 6, 2000);
        let add_radish_receipt = await centralMark.addCropEntry(radish_name, 7, 3000);
        
        let potatoExists = await centralMark.cropExists(potato_name);
        let tomatoExists = await centralMark.cropExists(tomato_name);
        let radishExists = await centralMark.cropExists(radish_name);
        
        assert(potatoExists);
        assert(tomatoExists);
        assert(radishExists);

        let manifest = await centralMark.getInventoryManifest.call();

        // console.log("====Manifest====");
        // console.log(manifest);
        // console.log("================");

        //assert there is an array for each of name, price and qty
        assert.equal(Object.keys(manifest).length, 3);
        //assert each array has an element for each crop entry
        assert.equal(manifest[0].length, 3);
        assert.equal(manifest[1].length, 3);
        assert.equal(manifest[2].length, 3);
    });

    // check for sufficient inv
    // check for insufficient inv
    it('#verifySufficientInventory', async function(){

    });

    // check for sufficient funds
    // check for insufficient funds
    it('#checkout', async function(){

    });

    it('#method', async function(){

    });


});