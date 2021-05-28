pragma solidity >=0.6.0 <0.8.0;
pragma experimental ABIEncoderV2;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
//docs-v3.x | 3.4 uses >=0.6.0 <0.8.0

// import "./appStorages/FinanceAppStorage.sol";
// import "./FoodToken.sol";// should be facet

import "./libraries/LibDiamond.sol";
import "./libraries/LibAccessControl.sol";
import "./appStorages/AccessControlStorage.sol";
import "./interfaces/IDiamondLoupe.sol";
import "./interfaces/IDiamondCut.sol";
import "./interfaces/IERC173.sol";

//rm accessControl?
contract FinanceDiamond {

/////////////////////////
    //ERC20 private foodCoin;
    //FinanceAppStorage internal s;


    struct DiamondArgs {
        address owner;
    }

    // constructor(address _token_contract_address) public {
        
    //     _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);

    //     foodCoin = FoodToken(_token_contract_address);
        
    //     //market cannot be added in the constructor because it would create circular dependency
    //     //it should be added in migrations/2_deploy_contracts.js after both are deployed
    // }

    constructor(IDiamondCut.FacetCut[] memory _diamondCut, DiamondArgs memory _args) payable {
        LibDiamond.diamondCut(_diamondCut, address(0), new bytes(0));
        LibDiamond.setContractOwner(_args.owner);
        bytes32 DEFAULT_ADMIN_ROLE = 0x00;
        bytes32 MARKET_ROLE = keccak256("MARKET_ROLE");
        LibAccessControl._setupRole(DEFAULT_ADMIN_ROLE, _args.owner);
        LibAccessControl._setupRole(MARKET_ROLE, _args.owner);
        //_setupRole(DEFAULT_ADMIN_ROLE, _args.owner);

        
    }
    
    fallback() external payable {
        LibDiamond.DiamondStorage storage ds;
        bytes32 position = LibDiamond.DIAMOND_STORAGE_POSITION;
        assembly {
            ds.slot := position
        }
        address facet = address(bytes20(ds.facetAddressAndSelectorPositionMap[msg.sig].facetAddress));
        require(facet != address(0), "Diamond: Function does not exist");
        assembly {
            calldatacopy(0, 0, calldatasize())
            let result := delegatecall(gas(), facet, 0, calldatasize(), 0, 0)
            returndatacopy(0, 0, returndatasize())
            switch result
                case 0 {
                    revert(0, returndatasize())
                }
                default {
                    return(0, returndatasize())
                }
        }
    }
}