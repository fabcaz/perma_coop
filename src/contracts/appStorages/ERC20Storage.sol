pragma solidity >=0.6.0 <0.8.0;

library ERC20Storage{

    bytes32 constant ERC20_POSITION = 
    keccak256("perma_coop.src.contracts.appStorages.ERC20Storage");

    struct ERC20Struct{
        // vars form the openzepplin ERC20.sol
        mapping (address => uint256) _balances;

        mapping (address => mapping (address => uint256)) _allowances;

        uint256 _totalSupply;

        string _name;
        string _symbol;
        uint8 _decimals;
    }

    function erc20Storage() internal pure returns (ERC20Struct storage erc20s) {
        bytes32 position = ERC20_POSITION;
        assembly {
            erc20s.slot := position
        }
    }

}