const { util } = require("chai");

const FinanceDiamond     = artifacts.require('FinanceDiamond');
const DiamondCutFacet    = artifacts.require('DiamondCutFacet');
const DiamondLoupeFacet  = artifacts.require('DiamondLoupeFacet');
const OwnershipFacet     = artifacts.require('OwnershipFacet');
const FoodTokenFacet     = artifacts.require('FoodTokenFacet');
const StoreCheckoutFacet = artifacts.require('StoreCheckoutFacet');
const AccessControlFacet = artifacts.require('AccessControlFacet')

const FacetCutAction = {
  Add: 0,
  Replace: 1,
  Remove: 2
}

function getSelectors (contract) {
    //console.log("abi: "+util.inspect(contract.abi))
  const selectors = contract.abi.reduce((acc, val) => {
    if (val.type === 'function') {
    //console.log(val.name)
    //console.log(val.signature)
      acc.push(val.signature)
      return acc;
    } else {
      return acc;
    }
  }, [])
  return selectors;
}

function removeItem (array, item) {
  array.splice(array.indexOf(item), 1);
  return array;
}

function findPositionInFacets (facetAddress, facets) {
  for (let i = 0; i < facets.length; i++) {
    if (facets[i].facetAddress === facetAddress) {
      return i;
    }
  }
}

//put all the facets(done in deployment)
//verify that all the facets are mounted on the diamond
//verify that the selectors are mounted correctly
//try to call some facet functions

contract('FinanceDiamondTest', async (accounts) => {
    let diamondCutFacet;
    let diamondLoupeFacet; 
    let ownershipFacet;
    let accessControlFacet;
    let diamond;
    let result;
    let addresses = [];
  
    const zeroAddress = '0x0000000000000000000000000000000000000000'
  
    before(async () => {
        financeDiamond = await FinanceDiamond.deployed();
        diamondCutFacet    = new web3.eth.Contract(DiamondCutFacet.abi, financeDiamond.address);
        diamondLoupeFacet  = new web3.eth.Contract(DiamondLoupeFacet.abi, financeDiamond.address);
        ownershipFacet     = new web3.eth.Contract(OwnershipFacet.abi, financeDiamond.address);
        foodTokenFacet     = new web3.eth.Contract(FoodTokenFacet.abi, financeDiamond.address);
        storeCheckoutFacet = new web3.eth.Contract(StoreCheckoutFacet.abi, financeDiamond.address);
        accessControlFacet = new web3.eth.Contract(AccessControlFacet.abi, financeDiamond.address);
        
      
      web3.eth.defaultAccount = accounts[0];
    });
  
    it('should have six facets -- call to facetAddresses function', async () => {
      for (const address of await diamondLoupeFacet.methods.facetAddresses().call()) {
        addresses.push(address);
      }  
      // console.log(addresses)
      assert.equal(addresses.length, 6);
    });

    it('facets should have the right function selectors -- call to facetFunctionSelectors function', async () => {
        let selectors = getSelectors(DiamondCutFacet);
        //console.log("_______________");
        result = await diamondLoupeFacet.methods.facetFunctionSelectors(addresses[0]).call();
        assert.sameMembers(result, selectors);
        selectors = getSelectors(DiamondLoupeFacet);
        //console.log("_______________");
        result = await diamondLoupeFacet.methods.facetFunctionSelectors(addresses[1]).call();
        assert.sameMembers(result, selectors);
        selectors = getSelectors(OwnershipFacet);
        //console.log("_______________");
        result = await diamondLoupeFacet.methods.facetFunctionSelectors(addresses[2]).call();
        assert.sameMembers(result, selectors);
        selectors = getSelectors(FoodTokenFacet);
        //console.log("_______________") ; 
        result = await diamondLoupeFacet.methods.facetFunctionSelectors(addresses[3]).call();
        assert.sameMembers(result, selectors);
        selectors = getSelectors(StoreCheckoutFacet);
        //console.log("_______________");
        result = await diamondLoupeFacet.methods.facetFunctionSelectors(addresses[4]).call();
        assert.sameMembers(result, selectors);
        selectors = getSelectors(AccessControlFacet);
        //console.log("_______________");
        result = await diamondLoupeFacet.methods.facetFunctionSelectors(addresses[5]).call();
        assert.sameMembers(result, selectors);
      });

      // ...
});  