/* test:

 revokeRole 
*/
const { util, assert } = require("chai");
const {expectRevert} = require('@openzeppelin/test-helpers');
const FinanceDiamond     = artifacts.require('FinanceDiamond');
const AccessControlFacet     = artifacts.require('AccessControlFacet');

contract('FinanceDiamond -- AccessControlFacet', async (accounts) => {
    let foodTokenFacet;
    const DEFAULT_ADMIN_ROLE = '0x0000000000000000000000000000000000000000000000000000000000000000'
  
    before(async () => {
      financeDiamond = await FinanceDiamond.deployed();
      accessControlFacet = new web3.eth.Contract(AccessControlFacet.abi, financeDiamond.address);
      
    });

    it('accounts[0] should have DEFAULT_ADMIN_ROLE', async () => {
        //accounts[0] is granted this role in the diamond's contructor

        let role_to_grant = DEFAULT_ADMIN_ROLE;        
        // let acc0_hasRole = await accessControlFacet.methods.hasRole(role_to_grant, accounts[0]).call();
        // console.log("acct0 has DEFAULT_ADMIN_ROLE: "+ acc0_hasRole);
        // let acc5_hasRole = await accessControlFacet.methods.hasRole(role_to_grant, accounts[4]).call();
        // console.log("acct5 has DEFAULT_ADMIN_ROLE: "+ acc5_hasRole);
        assert.equal(
            await accessControlFacet.methods.getRoleMemberCount(role_to_grant).call(),
            1,
            "member count for MarketRole != 1"
        );
        assert(
            await accessControlFacet.methods.hasRole(role_to_grant, accounts[0]).call(),
            "acct0 does not have role"
        );
        assert(
            !(await accessControlFacet.methods.hasRole(role_to_grant, accounts[5]).call()),
            "acct5 should not have role"
        );
        
    });

    it('what is new role\'s admin role', async () => {
        
        let role_to_grant = web3.utils.sha3("MARKET_ROLE");
        
        let market_role_adminRole = await accessControlFacet.methods.getRoleAdmin(role_to_grant).call();
        //console.log("MARKET_ROLE admin_role: "+ market_role_adminRole);

        assert.equal(DEFAULT_ADMIN_ROLE, market_role_adminRole, "MARKET_ROLE's adminRole is not DEFAULT_ADMIN_ROLE")
        
    });

    // can apparently only grant roles that have already been granted once in constructor
    it('should grantRole', async () => {
        
        let role_to_grant = web3.utils.sha3("MARKET_ROLE");
        
        // let acc0_hasRole = await accessControlFacet.methods.hasRole(role_to_grant, accounts[0]).call();
        // console.log("acct0 has MARKET_ROLE: "+ acc0_hasRole);
        // let acc4_hasRole = await accessControlFacet.methods.hasRole(role_to_grant, accounts[4]).call();
        // console.log("acct4 has MARKET_ROLE: "+ acc4_hasRole);
        // let market_RoleMemberCount = await accessControlFacet.methods.getRoleMemberCount(role_to_grant).call();
        // console.log("MARKET_ROLE count: "+ market_RoleMemberCount);
        // let market_role_adminRole = await accessControlFacet.methods.getRoleAdmin(role_to_grant).call();
        // console.log("MARKET_ROLE admin role: "+ market_role_adminRole);        
        
        let granting_market_role = await accessControlFacet.methods.grantRole(role_to_grant, accounts[4]).send({from: accounts[0]});    
        //console.log("granting_market_role: "+ util.inspect(granting_market_role))
        
        assert(
            await accessControlFacet.methods.hasRole(role_to_grant, accounts[4]).call(),
            "acct does not have role"
        );
        assert.equal(
            await accessControlFacet.methods.getRoleMemberCount(role_to_grant).call(),
            2,
            "member count for MarketRole != 2"
        );
        assert.equal(
            await accessControlFacet.methods.getRoleMember(role_to_grant, 1).call(),
            accounts[4],
            "MarketRole not set for acct"
        );
    });

    it('should revokeRole', async () => {
        let default_admin_role = '0x00';
        let role_to_grant = web3.utils.sha3("MARKET_ROLE");
        
        let acc4_hasRole = await accessControlFacet.methods.hasRole(role_to_grant, accounts[4]).call();
        let market_RoleMemberCount = await accessControlFacet.methods.getRoleMemberCount(role_to_grant).call();
                
        assert( acc4_hasRole, "acct does not have role");
        assert.equal( market_RoleMemberCount, 2, "member count for MarketRole != 2");
        
        let revoking_market_role = await accessControlFacet.methods.revokeRole(role_to_grant, accounts[4]).send({from: accounts[0]});    
        //console.log("revoking_market_role: "+ util.inspect(revoking_market_role))

        acc4_hasRole = await accessControlFacet.methods.hasRole(role_to_grant, accounts[4]).call();
        market_RoleMemberCount = await accessControlFacet.methods.getRoleMemberCount(role_to_grant).call();
                        
        assert( !acc4_hasRole, "acct4 shouldn't have role");
        assert.equal( market_RoleMemberCount, 1, "member count for MarketRole != 1");        
    });
});