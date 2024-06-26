 pragma solidity >=0.6.0 <0.8.0;

//import "./services/PriceApiGETservice.sol";
//import "./CentralReserve.sol";
//import "./enums/Crop.sol";

// contracts/CentralReserve.sol
// contracts/services/PriceApiGETservice.sol


// extend AccessControl
contract CentralMarket{
  

    /*
    1. priceApiGETservice to get Food price
    2. collections to store available products + setters anf getters
    3. CentralReserve to handle tx between market an members
     */

    //PriceApiGETservice private priceApiGETservice;
    //CentralReserve private centralReserve;


    bytes32[] private crop_names;
    mapping(bytes32 => ProductInfo) private crop_price_and_qty;

    struct ProductInfo{
      uint256 price;
      uint256 qty;
      uint256 keys_array_idx;
    }


    constructor() public {
        
        //centralReserve = CentralReserve(_reserve_contract_address);
        

    }




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
//payable or external?
  function checkout(address _customer, bytes32[] memory _order_name_details, uint256[] memory _order_qty_details, uint _amount_due) public{

    //should accept a tuple of 2 arrays as arg; ([...names], [...quantities])
    // bytes32[] memory names_arr = _order_details.0.length;
    // uint256[] memory quantities_arr = _order_details.1.length;

    require(_order_name_details.length == _order_qty_details.length, "_order_detail is missing data");

    bool is_inventory_sufficient = false;

    //maybe create a third array to indicate which order line cannot fulfilled
    //maybe take _fulfill_incompele_order flag as arg
    for(uint i = 0 ; i < _order_name_details.length ; i++){      
      is_inventory_sufficient = verifySufficientInventory(_order_name_details[i], _order_qty_details[i]);
    }
    require(is_inventory_sufficient, "insufficient inventory");

    //centralReserve.executeCheckoutTransaction(_customer, _amount_due);
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

  function getCropCount() public view returns(uint256) {
   return crop_names.length;
 }

  function getCropPrice(bytes32 _name) public view returns(uint256) {
    require(cropExists(_name), "Crop does not exist");
    return crop_price_and_qty[_name].price;
  }

  function getCropQty(bytes32 _name) public view returns(uint256) {
    require(cropExists(_name), "Crop does not exist");
    return crop_price_and_qty[_name].qty;
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
      prices[i]     = crop_price_and_qty[curr_name].price;
      quantities[i] = crop_price_and_qty[curr_name].qty;
    }
    emit Step("after for loop");
    emit ManifestRequest(names, prices, quantities);

    return(names, prices, quantities);
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

  function verifySufficientInventory(bytes32 _name, uint qty) public view returns(bool) {
    return getCropQty(_name) >= qty;
  }

  



  


  // //should be frontend
  // function put_in_cart() public{
  //   // reserve/hold inventory items for purchase (put time limit)
  //   //
  // }

  //should be frontend
  
// pay and checkout do the same thing
  // //should be frontend
  // function pay() public{
  //   // call appropriate method from CentralReserve to perform transaction/ transfer funds from HDWallet to CentralMarket
  //   //
  // }

}