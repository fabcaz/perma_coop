pragma solidity >=0.6.0 <0.8.0;
pragma abicoder v2;

//import "../libraries/LibERC20.sol";
//import "../appStorages/AccessControlRoles.sol";
import "../libraries/LibAccessControl.sol";

contract AccessControlFacet {

    function hasRole(bytes32 _role, address _account) public view returns (bool) {
        return LibAccessControl.hasRole(_role, _account);
    }

    function getRoleMemberCount(bytes32 _role) public view returns (uint256) {
        return LibAccessControl.getRoleMemberCount(_role);
    }

    function getRoleMember(bytes32 _role, uint256 _index) public view returns (address) {
        return LibAccessControl.getRoleMember(_role, _index);
    }

    function getRoleAdmin(bytes32 _role) public view returns (bytes32) {
        return LibAccessControl.getRoleAdmin(_role);
    }

    function grantRole(bytes32 _role, address _account) public {
        return LibAccessControl.grantRole(_role, _account);
    }

    function revokeRole(bytes32 _role, address _account) public {
        return LibAccessControl.revokeRole(_role, _account);
    }

    function renounceRole(bytes32 _role, address _account) public {
        return LibAccessControl.renounceRole(_role, _account);
    }
    //should require that sender have the default admin role
    function _setRoleAdmin(bytes32 _role, bytes32 _adminRole) public {
        return LibAccessControl._setRoleAdmin(_role, _adminRole);
    }

}