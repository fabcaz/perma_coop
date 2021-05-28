pragma solidity >=0.6.0 <0.8.0;
pragma abicoder v2;


import "../libraries/LibERC20.sol";

contract FoodTokenFacet{
    function name() public view returns (string memory) {
        return LibERC20.name();
    }


    function symbol() public view returns (string memory) {
        return LibERC20.symbol();
    }


    function decimals() public view returns (uint8) {
        return LibERC20.decimals();
    }


    function totalSupply() public view returns (uint256) {
        return LibERC20.totalSupply();
    }
    
    function balanceOf(address _account) public view returns (uint256) {
        return LibERC20.balanceOf(_account);
    }

    function transfer(address _recipient, uint256 _amount) public returns (bool) {
        return LibERC20.transfer(_recipient, _amount);
    }

    function allowance(address _owner, address _spender) public view returns (uint256) {
        return LibERC20.allowance(_owner, _spender);
    }


    function approve(address _spender, uint256 _amount) public returns (bool) {
        return LibERC20.approve(_spender, _amount);
    }


    function transferFrom(address _sender, address _recipient, uint256 _amount) public returns (bool) {
        return LibERC20.transferFrom(_sender, _recipient, _amount);
    }

    function mint(address _account, uint256 _amount) public{
        return LibERC20._mint(_account, _amount);
    }

    function burn(address _account, uint256 _amount) public{
        return LibERC20._burn(_account, _amount);
    }

    function setupName(string memory _name) public {
        return LibERC20._setupName(_name);
    }

    function setupSymbol(string memory _symbol) public {
        return LibERC20._setupSymbol(_symbol);
    }

    function setupDecimals(uint8 _decimals) public {
        return LibERC20._setupDecimals(_decimals);
    }
}