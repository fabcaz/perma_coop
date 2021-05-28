pragma solidity >=0.6.0 <0.8.0;
pragma abicoder v2;

import "../libraries/LibERC20.sol";
// import "../appStorages/AccessControlRoles.sol";
// import "../appStorages/LibAccessControl.sol";

contract StoreCheckoutFacet {

    
    function checkout(address _recipient, uint _amount) public {
        //approve the owner to spend on their own behalf
        LibERC20.approve(msg.sender, _amount);
        LibERC20.transferFrom(msg.sender, _recipient, _amount);        
    }


}