import assert from 'assert';
import React, { Component } from 'react'
import {Table} from 'react-bootstrap'

import Web3 from 'web3'
import InventoryRow from './InventoryRow.js'


class InventoryTable extends Component{

    createRows(){
        //console.log("@@@ createRows start @@@");
        const util = require('util')
        const web3 = window.web3;
        //console.log("this.props.marketInventory: "+ util.inspect(this.props))
        let nameArr = this.props.marketInventory[0];
        let priceArr = this.props.marketInventory[1];
        let qtyArr = this.props.marketInventory[2];
        let res = []

        try{

        
        assert(nameArr.length === priceArr.length
            && priceArr.length === qtyArr.length
            && qtyArr.length === nameArr.length,
             "Arrays have differnt lengths");
        }catch(e){
            console.log("THE ERROR: "+e);
            //console.log("@@@ createRows end @@@");
            return
        }
        //using idx as key because order should not change after being loaded from contract
        for(let i = 0 ; i < nameArr.length; i++){
            //console.log("ROW :: qty -> "+ i +" :: "+qtyArr[i])
            
            res.push(
                <InventoryRow
                    key   = {i}
                    idx   = {i}
                    name  = {web3.utils.hexToAscii(nameArr[i])}
                    price = {priceArr[i]}
                    qty   = {qtyArr[i]}
                    updateCartEntry_func={this.props.updateCartEntry_func}
                />
            )
        }

        //console.log("@@@ createRows end @@@");
        return res;
      }

    render(){

        let header = this.props.header;

        return(
            <Table responsive>
                <thead>
                    <tr>
                    {header.map((currentValue, index) => (
                        <th key={index}>{currentValue}</th>
                    ))}
                    </tr>
                </thead>
                <tbody>
                    {this.createRows()}
                </tbody>
            </Table>
        )
    }
}

export default InventoryTable;