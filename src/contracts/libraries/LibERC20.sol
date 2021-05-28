pragma solidity >=0.6.0 <0.8.0;
pragma abicoder v2;
// import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

import "@openzeppelin/contracts/math/SafeMath.sol";


// declare FinanceAppStorage state var
// append "ds." to all state vars
import "../appStorages/ERC20Storage.sol";
import "../libraries/LibAccessControl.sol";// as lAC;
import "../appStorages/AccessControlRoles.sol";


// use LibAccessControl
library LibERC20 {
    using SafeMath for uint256;
    
    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value);

    function name() internal view returns (string memory) {
        ERC20Storage.ERC20Struct storage erc20s = ERC20Storage.erc20Storage();
        return erc20s._name;
    }


    function symbol() internal view returns (string memory) {
        ERC20Storage.ERC20Struct storage erc20s = ERC20Storage.erc20Storage();
        return erc20s._symbol;
    }


    function decimals() internal view returns (uint8) {
        ERC20Storage.ERC20Struct storage erc20s = ERC20Storage.erc20Storage();
        return erc20s._decimals;
    }


    function totalSupply() internal view returns (uint256) {
        ERC20Storage.ERC20Struct storage erc20s = ERC20Storage.erc20Storage();
        return erc20s._totalSupply;
    }
    
    function balanceOf(address account) internal view returns (uint256) {
        //require(msg.sender == account || LibAccessControl.hasRole(BANK_ROLE, msg.sender), "Not allowed to view balance for this account");
        ERC20Storage.ERC20Struct storage erc20s = ERC20Storage.erc20Storage();
        return erc20s._balances[account];
    }


    function transfer(address recipient, uint256 amount) internal returns (bool) {
        _transfer(msg.sender, recipient, amount);
        return true;
    }


    function allowance(address owner, address spender) internal view returns (uint256) {
        ERC20Storage.ERC20Struct storage erc20s = ERC20Storage.erc20Storage();
        return erc20s._allowances[owner][spender];
    }


    function approve(address spender, uint256 amount) internal returns (bool) {
        _approve(msg.sender, spender, amount);
        return true;
    }


    function transferFrom(address sender, address recipient, uint256 amount) internal returns (bool) {
        ERC20Storage.ERC20Struct storage erc20s = ERC20Storage.erc20Storage();
        _transfer(sender, recipient, amount);
        _approve(sender, msg.sender, erc20s._allowances[sender][msg.sender].sub(amount, "ERC20: transfer amount exceeds allowance"));
        return true;
    }

    function _transfer(address sender, address recipient, uint256 amount) internal {
        require(sender != address(0), "ERC20: transfer from the zero address");
        require(recipient != address(0), "ERC20: transfer to the zero address");

        ERC20Storage.ERC20Struct storage erc20s = ERC20Storage.erc20Storage();
        _beforeTokenTransfer(sender, recipient, amount);

        erc20s._balances[sender] = erc20s._balances[sender].sub(amount, "ERC20: transfer amount exceeds balance");
        erc20s._balances[recipient] = erc20s._balances[recipient].add(amount);
        emit Transfer(sender, recipient, amount);
    }


    function _mint(address account, uint256 amount) internal {
        //require(LibAccessControl.hasRole(DEFAULT_ADMIN_ROLE, msg.sender) || LibAccessControl.hasRole(BANK_ROLE, msg.sender));
        require(account != address(0), "ERC20: mint to the zero address");

        ERC20Storage.ERC20Struct storage erc20s = ERC20Storage.erc20Storage();
        _beforeTokenTransfer(address(0), account, amount);

        erc20s._totalSupply = erc20s._totalSupply.add(amount);
        erc20s._balances[account] = erc20s._balances[account].add(amount);
        emit Transfer(address(0), account, amount);
    }


    function _burn(address account, uint256 amount) internal {
        //require(LibAccessControl.hasRole(DEFAULT_ADMIN_ROLE, msg.sender) || LibAccessControl.hasRole(BANK_ROLE, msg.sender));
        require(account != address(0), "ERC20: burn from the zero address");

        ERC20Storage.ERC20Struct storage erc20s = ERC20Storage.erc20Storage();
        _beforeTokenTransfer(account, address(0), amount);

        erc20s._balances[account] = erc20s._balances[account].sub(amount, "ERC20: burn amount exceeds balance");
        erc20s._totalSupply = erc20s._totalSupply.sub(amount);
        emit Transfer(account, address(0), amount);
    }


    function _approve(address owner, address spender, uint256 amount) internal {
        require(owner != address(0), "ERC20: approve from the zero address");
        require(spender != address(0), "ERC20: approve to the zero address");

        ERC20Storage.ERC20Struct storage erc20s = ERC20Storage.erc20Storage();
        erc20s._allowances[owner][spender] = amount;
        emit Approval(owner, spender, amount);
    }

    function _setupName(string memory  name_) internal {
        //require(LibAccessControl.hasRole(DEFAULT_ADMIN_ROLE, msg.sender) || LibAccessControl.hasRole(BANK_ROLE, msg.sender), "You cannot change the name");
        ERC20Storage.ERC20Struct storage erc20s = ERC20Storage.erc20Storage();
        erc20s._name = name_;
    }

    function _setupSymbol(string memory symbol_) internal {
        //require(LibAccessControl.hasRole(DEFAULT_ADMIN_ROLE, msg.sender) || LibAccessControl.hasRole(BANK_ROLE, msg.sender));
        ERC20Storage.ERC20Struct storage erc20s = ERC20Storage.erc20Storage();
        erc20s._symbol = symbol_;
    }

    function _setupDecimals(uint8 decimals_) internal {
        //require(LibAccessControl.hasRole(DEFAULT_ADMIN_ROLE, msg.sender) || LibAccessControl.hasRole(BANK_ROLE, msg.sender));
        ERC20Storage.ERC20Struct storage erc20s = ERC20Storage.erc20Storage();
        erc20s._decimals = decimals_;
    }

    function _beforeTokenTransfer(address from, address to, uint256 amount) internal { }

}

