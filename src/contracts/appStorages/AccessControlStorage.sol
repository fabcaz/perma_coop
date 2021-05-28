pragma solidity >=0.6.0 <0.8.0;

//import "@openzeppelin/contracts/utils/EnumerableSet.sol";
import "@openzeppelin/contracts/utils/Address.sol";
import "./Eeee.sol";

library AccessControlStorage{

    bytes32 constant ACCESSCONTROL_POSITION = 
    keccak256("perma_coop.src.contracts.appStorages.AccessControlStorage");

    struct RoleData {
        //EnumerableSet.AddressSet members;
        Eeee.AddressSet members;
        bytes32 adminRole;
    }

    struct AccessControlStruct{
        mapping (bytes32 => RoleData) _roles;
    }    

    function accessControlStorage() internal pure returns (AccessControlStruct storage acs) {
        bytes32 position = ACCESSCONTROL_POSITION;
        assembly {
            acs.slot := position
        }
    }
}    