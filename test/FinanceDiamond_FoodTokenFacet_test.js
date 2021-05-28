const { util, assert } = require("chai");
const {expectRevert} = require('@openzeppelin/test-helpers');
const FinanceDiamond     = artifacts.require('FinanceDiamond');
const FoodTokenFacet     = artifacts.require('FoodTokenFacet');

contract('FinanceDiamond -- FoodTokenFacet', async (accounts) => {
    let foodTokenFacet;
  
    before(async () => {
      financeDiamond = await FinanceDiamond.deployed();
      foodTokenFacet = new web3.eth.Contract(FoodTokenFacet.abi, financeDiamond.address);
    });
  
    it('should update name', async () => {
        
        let new_name = "NEWNAME";
        await foodTokenFacet.methods.setupName(new_name).send({from: accounts[0]});
        
        let set_name = await foodTokenFacet.methods.name().call();
        
        //console.log("set_name: "+util.inspect(set_name))
        assert.equal(new_name, set_name);
    });

    it('should mint', async () => {
        
      let acc0_balance_start = await foodTokenFacet.methods.balanceOf(accounts[0]).call();
      let mint_amount = 100;
      
      await foodTokenFacet.methods.mint(accounts[0], mint_amount).send({from: accounts[0]});
      let acc0_balance_minted = await foodTokenFacet.methods.balanceOf(accounts[0]).call();
      
      let acc0_diff = Math.abs(acc0_balance_start - acc0_balance_minted);
      assert.equal(acc0_diff, mint_amount)
  });

    it('should transfer amount ', async () => {
      
      let acc0_balance_start = await foodTokenFacet.methods.balanceOf(accounts[0]).call();
      let acc1_balance_start = await foodTokenFacet.methods.balanceOf(accounts[1]).call();

      let transfer_amount = 5;
       
      await foodTokenFacet.methods.transfer(accounts[1], transfer_amount).send({from: accounts[0]});

      let acc0_balance_end = await foodTokenFacet.methods.balanceOf(accounts[0]).call();
      let acc1_balance_end = await foodTokenFacet.methods.balanceOf(accounts[1]).call();

      let acc0_diff = Math.abs(acc0_balance_start - acc0_balance_end);
      let acc1_diff = Math.abs(acc1_balance_start - acc1_balance_end);

      assert.equal(acc0_diff, transfer_amount)
      assert.equal(acc1_diff, transfer_amount)
      });

      it('should fail to transfer amount', async () => {
        await expectRevert(
          foodTokenFacet.methods.transfer(accounts[1], 9001).send({from: accounts[0]}),
          "ERC20: transfer amount exceeds balance"
        )
      });

      it('should approve amount', async () => {

        let allowed_amount = 6;

        let allowance_start = await foodTokenFacet.methods.allowance(accounts[0], accounts[1]).call();

        await foodTokenFacet.methods.approve(accounts[1], allowed_amount).send({from: accounts[0]});

        let allowance_end = await foodTokenFacet.methods.allowance(accounts[0], accounts[1]).call();
 
        let allowance_diff = Math.abs(allowance_start - allowance_end);

        assert.equal(allowed_amount, allowance_diff);
        //reset for next test since amount isn't spent
        await foodTokenFacet.methods.approve(accounts[1], 0).send({from: accounts[0]});
        assert.equal(allowed_amount, allowance_diff);
      });

      it('should TransferFrom', async () => {

        let acc0_balance_start = await foodTokenFacet.methods.balanceOf(accounts[0]).call();
        let acc1_balance_start = await foodTokenFacet.methods.balanceOf(accounts[1]).call();
        let acc2_balance_start = await foodTokenFacet.methods.balanceOf(accounts[2]).call();

        let allowed_amount = 6;

        let allowance_start = await foodTokenFacet.methods.allowance(accounts[0], accounts[1]).call();
        assert.equal(allowance_start, 0);
        await foodTokenFacet.methods.approve(accounts[1], allowed_amount).send({from: accounts[0]});

        let allowance_after_approval = await foodTokenFacet.methods.allowance(accounts[0], accounts[1]).call();
        assert.equal(allowance_after_approval, allowed_amount);
        await foodTokenFacet.methods.transferFrom(accounts[0], accounts[2], allowed_amount).send({from: accounts[1]});

        let allowance_after_transferFrom = await foodTokenFacet.methods.allowance(accounts[0], accounts[1]).call();
        assert.equal(allowance_after_transferFrom, 0);

        let acc0_balance_after_transferFrom = await foodTokenFacet.methods.balanceOf(accounts[0]).call();
        let acc1_balance_after_transferFrom = await foodTokenFacet.methods.balanceOf(accounts[1]).call();
        let acc2_balance_after_transferFrom = await foodTokenFacet.methods.balanceOf(accounts[2]).call();
        let acc0_diff = Math.abs(acc0_balance_start - acc0_balance_after_transferFrom)
        let acc1_diff = Math.abs(acc1_balance_start - acc1_balance_after_transferFrom)
        let acc2_diff = Math.abs(acc2_balance_start - acc2_balance_after_transferFrom)

        assert.equal(acc0_diff, allowed_amount);
        assert.equal(acc1_diff, 0);
        assert.equal(acc2_diff, allowed_amount);
      });

      it('should fail to TransferFrom', async () => {
        await expectRevert(
          foodTokenFacet.methods.transferFrom(accounts[0], accounts[2], 27).send({from: accounts[1]}),
          "ERC20: transfer amount exceeds allowance"
        )
      });
});