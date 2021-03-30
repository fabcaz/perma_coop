pragma solidity ^0.7.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

contract CentralRegisty{

    //replace string keys with Property_enum
    struct Member {
        string[5] property_keys;
        mapping(string => bytes32[]) properties;
        Labor labor;
    }

    //replace string keys with Labor_enum
    struct Labor{
        string[1] labor_keys;
        mapping(string => uint32) total_hours;
        //could use https://docs.chain.link/docs/initiators#cron ?
        mapping(string => uint8) curr_month_hours; //(reset every 30days OR call payout every 30d and have it reset the hours)
    }

    //replace string keys with Crop_enum
    struct Property {
        //Property_enum property_type;
        //month instead of season for uniformity
        uint32 curr_month_rented_area;
        uint32 area;
        string[] crops_sowed;
        mapping(string => uint16) yield_in_kg;
        //use bidirectional association with owners?
    }

    uint256 private num_of_members;
    mapping(bytes32 => Member) private members;

    uint256 private num_of_properties;
    mapping(bytes32 => Property) private _properties;

    function register__property(uint256 _area) public{
        //check if already registered else update with event
        //create Property instance
        //add instance to `properties`
        //get owner or register one if not yet registered
        //push property_id to owner.properties

    }

    function register_member() public{
        //check if already registered else update with event
        //create Member instance
        //add instance to `members`
        //property and labor activities should be registered separately
    }

    function deregister__property(uint256 _property) public{
        //check if registered 
        //remove entry
        //get owner or register one if not yet registered
        //remove property_id from owner.properties

    }

    function deregister_member() public{
        //check if registered
        //create Member instance
        //add instance to `members`
        //property and labor activities should be registered separately
    }

    //assume only one owner per property for now
    function update_property_rights(bytes32 _property, bytes32 _curr_owner, bytes32 _new_owner) public{
        //check if property is registered
        //check if owner is registered and currently owns property
        //apply change
    }

    function reset_monthly_contributions() public{
        //reset curr_month_hours for each member
        //reset curr_month_rented_area for each property
    }

    function reset_monthly_labor() private{
        
    }
    
    function reset_monthly_rent() private{
        
    }



}

