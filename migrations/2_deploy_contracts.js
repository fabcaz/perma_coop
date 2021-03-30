const FoodToken = artifacts.require("./FoodToken.sol");


const token_price = 1000000000000000; // externalise using .env
const token_qty = 1000000;


module.exports = async function(deployer, network, accounts){
    await deployer.deploy(FoodToken, token_qty, );
    const foodToken = await FoodToken.deployed();
}
