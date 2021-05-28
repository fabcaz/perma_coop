const CentralRegisty = artifacts.require("./CentralRegisty.sol");
const {BN, constants, expectEvent, expectRevert} = require('@openzeppelin/test-helpers');

contract('CentralRegisty', ([member1, member2]) => {
    let centralReg, num_of_members;
    let fake_address1 = "0x7ff3ABE1D5eAE33030eb4371bdd492a8dc5F1a76"

    beforeEach(async function(){
        centralReg = await CentralRegisty.new();
        console.log("&&&&&& BEFORE Registry &&&&&\n\n");
        //console.log("&&&&&& BEFORE start &&&&&&");
        //console.log(centralReg);
        //console.log("&&&&&& BEFORE done &&&&&&");
    });


    it('create_member', async function(){
        //create empty member (only an address, no labor or properties)
        //save member
        //verify that both Map and keys_array have been mutated
        //verify that the saved data in the array corresponds to that in the Map


        console.log("_1_ check that member_ids starts out empty");
        //console.log("--------=num_of_members=--------");
        num_of_members = await centralReg.member_count();
        //console.log(num_of_members);

        //console.log("--------=num_of_members.toNumber()=--------");
        console.log("\tNumber of members: "+num_of_members.toNumber());
        
        assert.equal(num_of_members.toNumber(), 0, 'member_ids.len should be 0');

        console.log("_2_ create member");
        let create_member_res = await centralReg.create_member();
        //console.log(create_member_res);

        console.log("_3_ check that 1 element has been pushed to member_ids");
        //console.log("--------=num_of_members=--------");
        num_of_members = await centralReg.member_count();
        //console.log(num_of_members);
        //console.log("--------=num_of_members.toNumber()=--------");
        console.log("\tNumber of members: "+num_of_members.toNumber());
        assert.equal(num_of_members.toNumber(), 1, 'member_ids.len should be 1');


        let first_member_id_element = await centralReg.get_member_id(0);
        // console.log("first_member_id_element: "+first_member_id_element);

        console.log("_4_ verify that member has been inserted correctly");
        let member_exists = await centralReg.member_exists(first_member_id_element);
        console.log("\tMember data in mapping matches data in keys_array: "+member_exists);
        assert(member_exists);

    })

    it('sets a member\'s user_name', async function(){

        console.log("_1_ create member");
        let create_member_res = await centralReg.create_member();
        
        let first_member_id_element = await centralReg.get_member_id(0);

        let new_user_name = web3.utils.asciiToHex("macha");
        console.log("_2_ set user_name");
        await centralReg.set_member_name(first_member_id_element, new_user_name);

        console.log("_3_ get user_name");
        let set_name = await centralReg.get_member_name(first_member_id_element);

        //set_name sliced to remove trailing 0s
        assert.equal(new_user_name, set_name.slice(0, new_user_name.length));


    })

    it('find_member_by_id -- search for nonexistant member; should revert', async function(){

        console.log("_1_ attempt find_member_by_id; should revert");
        
        let found_member_name = await expectRevert(
            centralReg.find_member_by_id.call(fake_address1),
            "revert"
        );

    })

    it('find_member_by_id -- currently only returns member\'s name', async function(){

        console.log("_1_ create member");
        let create_member_res = await centralReg.create_member();
        
        let first_member_id_element = await centralReg.get_member_id(0);

        let new_user_name = web3.utils.asciiToHex("macha");
        console.log("_2_ set user_name ");
        await centralReg.set_member_name(first_member_id_element, new_user_name);

        console.log("_3_ find_member_by_id");
        let found_member_name = await centralReg.find_member_by_id.call(first_member_id_element);
        
        let set_name = found_member_name.slice(0, new_user_name.length);        

        assert.equal(new_user_name, set_name);


    })

    it('delete_member_by_id -- member does not exist || array empty; should revert', async function(){

        console.log("_1_ check that member_ids is empty");

        num_of_members = await centralReg.member_count();

        console.log("\tNumber of members: "+num_of_members.toNumber());
        assert.equal(num_of_members.toNumber(), 0, 'member_ids.len should be 0');

        console.log("_2_ attempt to delete member; should revert");

        let first_member_id_element = await expectRevert(
            centralReg.delete_member_by_id(fake_address1),
            "revert"
        );

    })

    it('delete_member_by_id -- only 1 member created before deleting', async function(){

        console.log("_1_ check that member_ids starts out empty");

        num_of_members = await centralReg.member_count();

        console.log("\tNumber of members: "+num_of_members.toNumber());
        
        assert.equal(num_of_members.toNumber(), 0, 'member_ids.len should be 0');

        console.log("_2_ create member");
        let create_member_res = await centralReg.create_member();

        console.log("_3_ check that 1 element has been pushed to member_ids");

        num_of_members = await centralReg.member_count();

        console.log("\tNumber of members: "+num_of_members.toNumber());
        assert.equal(num_of_members.toNumber(), 1, 'member_ids.len should be 1');

        console.log("_4_ delete member");
        let first_member_id_element = await centralReg.get_member_id(0);

        await centralReg.delete_member_by_id(first_member_id_element);

        console.log("_5_ verify that member is no longer retrievable");
        let member_exists = await centralReg.member_exists(first_member_id_element);
        console.log("\tMember data in mapping matches data in keys_array: "+member_exists);
        assert(!member_exists);

        console.log("_6_ check that member_ids has been popped");

        num_of_members = await centralReg.member_count();

        console.log("\tNumber of members: "+num_of_members.toNumber());
        
        assert.equal(num_of_members.toNumber(), 0, 'member_ids.len should be 0');        

    })

    it('delete_member_by_id -- more than 1 member created before deleting', async function(){

        console.log("_1_ check that member_ids starts out empty");

        num_of_members = await centralReg.member_count();

        console.log("\tNumber of members: "+num_of_members.toNumber());
        
        assert.equal(num_of_members.toNumber(), 0, 'member_ids.len should be 0');

        console.log("_2_ create 2 members");
        await centralReg.create_member();
        await centralReg.create_member();

        console.log("_3_ check that 1 element has been pushed to member_ids");

        num_of_members = await centralReg.member_count();

        console.log("\tNumber of members: "+num_of_members.toNumber());
        assert.equal(num_of_members.toNumber(), 2, 'member_ids.len should be 2');

        console.log("_4_ delete member");
        let first_member_id_element = await centralReg.get_member_id(0);
        let last_member_id_element = await centralReg.get_member_id(1);

        // console.log("\t First idx b4 DELETE: "+await centralReg.get_member_idx(first_member_id_element));
        // console.log("\t First address b4 DELETE: "+first_member_id_element);

        // console.log("\t Last idx b4 DELETE: "+await centralReg.get_member_idx(last_member_id_element));
        // console.log("\t Last address b4 DELETE: "+last_member_id_element);        

        await centralReg.delete_member_by_id(first_member_id_element);    

        console.log("_5_ verify that deleted member is no longer retrievable");
        let member_exists = await centralReg.member_exists(first_member_id_element);
        console.log("\tMember data in mapping matches data in keys_array: "+member_exists);
        assert(!member_exists);

        console.log("_6_ check that member_ids has been popped");

        num_of_members = await centralReg.member_count();

        console.log("\tNumber of members: "+num_of_members.toNumber());
        
        assert.equal(num_of_members.toNumber(), 1, 'member_ids.len should be 1');
    });



});