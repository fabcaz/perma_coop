pragma solidity ^0.7.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

import "./FoodToken.sol" as foodTokenContract;
import "./CentralRegistry.sol" as centralRegistry;
import "./services/PayrollService.sol" as payrollService;


contract CentralReserve is AccessControl {


    // Create a new role identifier for the minter role
    bytes32 public constant RESERVE_ROLE = keccak256("RESERVE_ROLE");
    bytes32 public constant MARKET_ROLE = keccak256("MARKET_ROLE");
    bytes32 public constant LABORER_ROLE = keccak256("LABORER_ROLE");
    bytes32 public constant LAND_OWNER_ROLE = keccak256("LAND_OWNER_ROLE");


    constructor(address reserve){
        
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
        

    }
    
}