pragma solidity ^0.7.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

import "@openzeppelin/contracts/access/AccessControl.sol";


contract FoodToken is ERC20, AccessControl {

    // Create a new role identifier for the minter role
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");


    constructor(uint256 initialSupply, address minter) ERC20("FoodToken", "FOOD"){
        // Grant the minter role to a specified account
       // _setupRole(MINTER_ROLE, minter);

        _mint(msg.sender, initialSupply);
    }
    
}