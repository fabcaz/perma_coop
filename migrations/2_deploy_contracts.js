require('dotenv').config()

const { assert } = require('console');
const fs = require('fs');
const papa = require('papaparse');

const FoodToken = artifacts.require("./FoodToken.sol");
const CentralMarket = artifacts.require("./CentralMarket.sol");
const CentralReserve = artifacts.require("./CentralReserve.sol");


const TOKEN_PRICE = process.env.TOKEN_PRICE;
const TOKEN_QTY = process.env.TOKEN_QTY;
const IS_TEST_PROFILE = (process.env.LOCAL_TESTING == 1);
const SAMPLE_DATA_FILE_PATH = './migrations/sample_product_data.csv';

const util = require('util')
var sleep = require('sleep');

module.exports = async function(deployer, network, accounts){


    await deployContracts(deployer, SAMPLE_DATA_FILE_PATH, IS_TEST_PROFILE);

    const centralMarket = await CentralMarket.deployed();
    let inventory_count = await centralMarket.getCropCount();

    console.log("\n\n\nCHECKING COUNT\tinventory_count: "+ inventory_count)




}

async function deployContracts(depppp, sampleDataFilePath, isTesting){

    await depppp.deploy(FoodToken, TOKEN_QTY);
    const foodToken = await FoodToken.deployed();

    await depppp.deploy(CentralReserve, foodToken.address);
    const centralReserve = await CentralReserve.deployed();


    await depppp.deploy(CentralMarket, centralReserve.address);
    const centralMarket = await CentralMarket.deployed();

    console.log("IS_TEST_PROFILE: "+ String(IS_TEST_PROFILE));


    if(isTesting){

        var line_count=0;

        let file = fs.createReadStream(sampleDataFilePath);

        await papa.parse(file, {
            encoding: "utf-8",
            step: async function(line) {
                //console.log(line_count+" inserting: "+ util.inspect(line.data));
                centralMarket.addCropEntry(web3.utils.asciiToHex(line.data[0]), line.data[1], line.data[2]);
                line_count ++;
            },
        });
    }
    return line_count;
}

