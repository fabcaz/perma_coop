import assert from 'assert';
import React, { Component } from 'react'
import {Table} from 'react-bootstrap'

import Web3 from 'web3'


class InventoryTable extends Component{

    // constructor(props){
    //     super(props);
  

    //     this.createRows = this.createRows.bind(this);
    //   }

    createRows(){
        console.log("@@@ createRows start @@@");
        const util = require('util')
        const web3 = window.web3;
        console.log("this.props.marketInventory: "+ util.inspect(this.props))
        let nameArr = this.props.marketInventory[0];
        let priceArr = this.props.marketInventory[1];
        let qtyArr = this.props.marketInventory[2];
        let res = []

        // try{
        //     console.log("nameArr: "+nameArr)
        //     console.log("nameArr Length: "+nameArr.length)
        //     console.log("priceArr: "+priceArr)
        //     console.log("priceArr Length: "+priceArr.length)
        //     console.log("qtyArr: "+qtyArr)
        //     console.log("qtyArr Length: "+qtyArr.length)
        // }catch(e){
        //     console.log("THE ERROR: "+e);
        //     return
        // }

        try{

        
        assert(nameArr.length === priceArr.length && priceArr.length === qtyArr.length && qtyArr.length === nameArr.length, "Arrays have differnt lengths");
        }catch(e){
            console.log("THE ERROR: "+e);
            console.log("@@@ createRows end @@@");
            return
        }
        //using idx as key because order should not change
        for(let i = 0 ; i < nameArr.length; i++){
            console.log("curr row is: "+ i)
            res.push(
                <tr key={i}>
                    <td>{web3.utils.hexToAscii(nameArr[i])}</td>
                    <td>{priceArr[i]}</td>
                    <td>{qtyArr[i]}</td>
                </tr>
            )
        }

        console.log("@@@ createRows end @@@");
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