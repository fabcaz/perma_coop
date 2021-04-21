 pragma solidity >=0.6.0 <0.8.0;

import "./services/PriceApiGETservice.sol";
//import "./CentralReserve.sol"
import "./enums/Crop.sol";

// contracts/CentralReserve.sol
// contracts/services/PriceApiGETservice.sol

contract CentralMarket{
  

    /*
    1. priceApiGETservice to get Food price
    2. collections to store available products + setters anf getters
    3. CentralReserve to handle tx between market an members
     */

    PriceApiGETservice private priceApiGETservice;
    //CentralReserve private centralReserve;

    //uint(Crop.crop_type.XXX) => qty of prduce in what ever unit
    bytes32[] private crop_names;
    mapping(bytes32 => ProductInfo) private crop_price_and_qty;

    struct ProductInfo{
      uint256 price;
      uint256 qty;
      uint256 keys_array_idx;
    }

/*
enum in mapping work around:
  enum TestEnum { ONE, TWO, THREE }
    mapping (uint => uint) testMapping;

    function getValueOne() constant returns(uint) {
        return testMapping[uint(TestEnum.ONE)];
    }

 */
event AddingName(bytes32 name);
//use access control to restrict access
function addCropEntry(bytes32 _name, uint256 _price, uint256 _qty) public{
  emit AddingName(_name);
  require(!cropExists(_name), "Crop already exists");
  emit AddingName(_name);
  crop_names.push(_name);
  crop_price_and_qty[_name] = ProductInfo(_price, _qty, crop_names.length - 1);  
}

//use access control to restrict access
function updateCropPrice(bytes32 _name, uint256 _price) public{

  require(cropExists(_name), "Crop does not exist");
  crop_price_and_qty[_name].price = _price;
}

//use access control to restrict access
function updateCropQty(bytes32 _name, uint256 _qty) public{

  require(cropExists(_name), "Crop does not exist");
  crop_price_and_qty[_name].qty = _qty;
} 

event Step(string);
event ManifestRequest(bytes32[], uint256[], uint256[]);
function getInventoryManifest() public  returns(bytes32[] memory, uint256[] memory, uint256[] memory){
  uint256 inventory_size = crop_names.length;
  
  bytes32[] memory names = new bytes32[](inventory_size);
  uint256[] memory prices = new uint256[](inventory_size);
  uint256[] memory quantities = new uint256[](inventory_size);

  bytes32 curr_name;


  for (uint i = 0; i < inventory_size; i++){
    curr_name = crop_names[i];
    
    names[i]      = curr_name;
    prices[i]     = crop_price_and_qty[curr_name].qty;
    quantities[i] = crop_price_and_qty[curr_name].qty;
  }
  emit Step("after for loop");
  emit ManifestRequest(names, prices, quantities);

  return(names, prices, quantities);
}

function getCropPrice(bytes32 _name) public view returns(uint256) {
  require(cropExists(_name), "Crop does not exist");
  return crop_price_and_qty[_name].price;
}

function getCropQty(bytes32 _name) public view returns(uint256) {
  require(cropExists(_name), "Crop does not exist");
  return crop_price_and_qty[_name].qty;
}

event Searched();

function cropExists(bytes32 _name) public view returns(bool){
  uint256 key = crop_price_and_qty[_name].keys_array_idx;
  //emit Searched();

  if (crop_names.length == 0 || crop_names.length < key){
    return false;
  }else{
    return crop_names[key] == _name;
  }
  
}

//  function getCropEnumValue(uint256 _number) public pure returns(Crop.crop_types){
//    return Crop.crop_types(_number);
//  }

//should be frontend
function put_in_cart() public{
   // reserve/hold inventory items for purchase (put time limit)
   //
}

//should be frontend
function checkout() public{
   // display cart content
   // procede to pay()


}

//should be frontend
function pay() public{
  // call appropriate method from CentralReserve to perform transaction/ transfer funds from HDWallet to CentralMarket
  //
}

//should be frontend
function cancel_order() public{
  // put items back on shelf
  //
}

}