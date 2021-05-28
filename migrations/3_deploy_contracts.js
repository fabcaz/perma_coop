require('dotenv').config()

const { assert } = require('console');
const fs = require('fs');
const papa = require('papaparse');

const CentralMarket = artifacts.require("./CentralMarket.sol");
const DiamondLoupeFacet = artifacts.require('DiamondLoupeFacet')
const FinanceDiamond = artifacts.require('FinanceDiamond')
const FoodTokenFacet = artifacts.require("./FoodTokenFacet.sol");


const TOKEN_PRICE = process.env.TOKEN_PRICE;
const TOKEN_QTY = process.env.TOKEN_QTY;
const IS_TEST_PROFILE = (process.env.LOCAL_TESTING == 1);
const SAMPLE_DATA_FILE_PATH = './migrations/sample_product_data.csv';

const util = require('util')

module.exports = async function(deployer, network, accounts){


    await deployer.deploy(CentralMarket);

    if(IS_TEST_PROFILE){
        await add_sample_inventory_data(SAMPLE_DATA_FILE_PATH);
    }

    const centralMarket = await CentralMarket.deployed();
    let inventory_count = await centralMarket.getCropCount();

    console.log("\n\n\nCHECKING COUNT\tinventory_count: "+ inventory_count)

    // const foodToken = await FoodToken.deployed();
    // await foodToken.transfer(accounts[1], '1000')

    // const centralReserve = await CentralReserve.deployed();

    // let role_to_grant = await centralReserve.MARKET_ROLE()
    // // console.log("role_to_grant: "+ role_to_grant)
    // await centralReserve.grantRole(role_to_grant, accounts[2])

    //
    //
    //  grant CentralmArket the MARKET_ROLE via FinanceDiamond
    //      need to have the bytes32 var here though
    //
    //
    // let role_to_grant = web3.utils.sha3("MARKET_ROLE");
    // await finDiamond.grantRole(role_to_grant, centralMarket.address);
    // await finDiamond.grantRole(role_to_grant, accounts[2]);//for test
    
    // console.log("market role count: " + await centralReserve.getRoleMemberCount(role_to_grant))

    

}

async function add_sample_inventory_data(sampleDataFilePath){

    const centralMarket = await CentralMarket.deployed();

    console.log("IS_TEST_PROFILE: "+ String(IS_TEST_PROFILE));    

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
    
    return line_count;
}

