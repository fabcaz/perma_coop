pragma solidity >=0.6.0 <0.8.0;
pragma abicoder v2;

import "@openzeppelin/contracts/GSN/Context.sol";

import "../appStorages/AccessControlStorage.sol";


library LibAccessControl{
    // using EnumerableSet for EnumerableSet.AddressSet;
    using Eeee for Eeee.AddressSet;
    using Address for address;
event thing3(string a);
    event RoleAdminChanged(bytes32 indexed role, bytes32 indexed previousAdminRole, bytes32 indexed newAdminRole);
    event RoleGranted(bytes32 indexed role, address indexed account, address indexed sender);
    event RoleRevoked(bytes32 indexed role, address indexed account, address indexed sender);

    function hasRole(bytes32 role, address account) internal view returns (bool) {
        AccessControlStorage.AccessControlStruct storage acs = AccessControlStorage.accessControlStorage();
        return acs._roles[role].members.contains(account);
    }

    function getRoleMemberCount(bytes32 role) internal view returns (uint256) {
        AccessControlStorage.AccessControlStruct storage acs = AccessControlStorage.accessControlStorage();
        return acs._roles[role].members.length();
    }

    function getRoleMember(bytes32 role, uint256 index) internal view returns (address) {
        AccessControlStorage.AccessControlStruct storage acs = AccessControlStorage.accessControlStorage();
        return acs._roles[role].members.at(index);
    }

    function getRoleAdmin(bytes32 role) internal view returns (bytes32) {
        AccessControlStorage.AccessControlStruct storage acs = AccessControlStorage.accessControlStorage();
        return acs._roles[role].adminRole;
    }

    function grantRole(bytes32 role, address account) internal {
        AccessControlStorage.AccessControlStruct storage acs = AccessControlStorage.accessControlStorage();
        require(hasRole(acs._roles[role].adminRole, msg.sender), "AccessControl: sender must be an admin to grant");
        _grantRole(role, account);
        //revert("FFF");
    }

    function revokeRole(bytes32 role, address account) internal {
        AccessControlStorage.AccessControlStruct storage acs = AccessControlStorage.accessControlStorage();
        require(hasRole(acs._roles[role].adminRole, msg.sender), "AccessControl: sender must be an admin to revoke");

        _revokeRole(role, account);
    }

    function renounceRole(bytes32 role, address account) internal {
        require(account == msg.sender, "AccessControl: can only renounce roles for self");

        _revokeRole(role, account);
    }

    function _setupRole(bytes32 role, address account) internal {
        _grantRole(role, account);
    }

    function _setRoleAdmin(bytes32 role, bytes32 adminRole) internal {
        AccessControlStorage.AccessControlStruct storage acs = AccessControlStorage.accessControlStorage();
        emit RoleAdminChanged(role, acs._roles[role].adminRole, adminRole);
        acs._roles[role].adminRole = adminRole;
    }

    function _grantRole(bytes32 role, address account) private {
        
        AccessControlStorage.AccessControlStruct storage acs = AccessControlStorage.accessControlStorage();
        
        if (acs._roles[role].members.add(account)) {
            emit RoleGranted(role, account, msg.sender);
        }
    }

    function _revokeRole(bytes32 role, address account) private {
        AccessControlStorage.AccessControlStruct storage acs = AccessControlStorage.accessControlStorage();
        if (acs._roles[role].members.remove(account)) {
            emit RoleRevoked(role, account, msg.sender);
        }
    }
}