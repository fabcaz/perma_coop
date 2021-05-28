
// const XXX = artifacts.require("XXX");

const { util } = require("chai")

const FinanceDiamond = artifacts.require('FinanceDiamond')
const DiamondCutFacet = artifacts.require('DiamondCutFacet')
const DiamondLoupeFacet = artifacts.require('DiamondLoupeFacet')
const OwnershipFacet = artifacts.require('OwnershipFacet')
const FoodTokenFacet = artifacts.require('FoodTokenFacet')
const StoreCheckoutFacet = artifacts.require('StoreCheckoutFacet')
const AccessControlFacet = artifacts.require('AccessControlFacet')

const TOKEN_QTY = process.env.TOKEN_QTY;

const FacetCutAction = {
    Add: 0,
    Replace: 1,
    Remove: 2
  }
  ///home/fc/blockchain/perma_coop/src/contracts/facets/ 52
function getSelectors (contract) {
    //console.log("CONTRACT: "+util.inspect(contract.sourcePath.split('/')[8]))
    
const selectors = contract.abi.reduce((acc, val) => {
        if (val.type === 'function') {
        // console.log(val.name)
        // console.log(val.signature)
        acc.push(val.signature)
        return acc
        } else {
        return acc
        }
    }, [])
    // console.log(selectors)
    console.log("__________")
return selectors
}



module.exports = async function (deployer, network, accounts) {
    await deployer.deploy(DiamondCutFacet);
    await deployer.deploy(DiamondLoupeFacet);
    await deployer.deploy(OwnershipFacet);
    await deployer.deploy(FoodTokenFacet);
    await deployer.deploy(StoreCheckoutFacet);
    await deployer.deploy(AccessControlFacet);
    //console.log ("AccessControlFacet.address:  "+AccessControlFacet.address)

    // console.log("===SELECTORS===")
    // console.log("> DiamondCutFacet: ")
    // await getSelectors(DiamondCutFacet)
    // console.log("> DiamondLoupeFacet: ")
    // await getSelectors(DiamondLoupeFacet)
    // console.log("> OwnershipFacet: ")
    // await getSelectors(OwnershipFacet)
    // console.log("> FoodTokenFacet: ")
    // await getSelectors(FoodTokenFacet)
    // console.log("> StoreCheckoutFacet: ")
    // await getSelectors(StoreCheckoutFacet)
    // console.log("> AccessControlFacet: ")
    // await getSelectors(AccessControlFacet)

    // console.log("=================")
    // console.log("===ADRSS===")
    // console.log("> DiamondCutFacet: ")
    // console.log(DiamondCutFacet.address)
    // console.log("> DiamondLoupeFacet: ")
    // console.log(DiamondLoupeFacet.address)
    // console.log("> OwnershipFacet: ")
    // console.log(OwnershipFacet.address)
    // console.log("> FoodTokenFacet: ")
    // console.log(FoodTokenFacet.address)
    // console.log("> StoreCheckoutFacet: ")
    // console.log(StoreCheckoutFacet.address)
    // console.log("> AccessControlFacet: ")
    // console.log(AccessControlFacet.address)
    // console.log("=================")


    const diamondCut = [
        [DiamondCutFacet.address,    FacetCutAction.Add, getSelectors(DiamondCutFacet)],
        [DiamondLoupeFacet.address,  FacetCutAction.Add, getSelectors(DiamondLoupeFacet)],
        [OwnershipFacet.address,     FacetCutAction.Add, getSelectors(OwnershipFacet)],
        [FoodTokenFacet.address,     FacetCutAction.Add, getSelectors(FoodTokenFacet)],
        [StoreCheckoutFacet.address, FacetCutAction.Add, getSelectors(StoreCheckoutFacet)],
        [AccessControlFacet.address, FacetCutAction.Add, getSelectors(AccessControlFacet)],
    ];
    // console.log("diamondCut len: "+ diamondCut.length)
    // console.log("diamondCut: "+ util.inspect(diamondCut));

    await deployer.deploy(FinanceDiamond, diamondCut, [accounts[0]]);
    console.log("DEPLOYED DIAMOND");
    // const finDiamond = await FinanceDiamond.deployed();

    // await finDiamond.setupName("FoodCoin");
    // await finDiamond.setupSymbol("FOOD");
    // await finDiamond.setupDecimals(TOKEN_QTY);

    // await finDiamond.transfer(accounts[1], '1000');

    
};
  