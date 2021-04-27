import React, { Component } from 'react'
import {Table} from 'react-bootstrap'

import CartRow from './CartRow.js'


class CartTable extends Component{

    createRows(){
        const web3 = window.web3;
        console.log("creating CartRows")
        let res = []
        //CartEntryJSONObj = {prod_idx: prod_idx, name: string, qty: number, subtotal: number}
        this.props.cart.forEach(cartEntryJSONObj => {        
         
            //console.log(util.inspect(cartEntryJSONObj));

            res.push(
            <CartRow key={cartEntryJSONObj.prod_idx}
                idx={cartEntryJSONObj.prod_idx}
                name={web3.utils.hexToAscii(cartEntryJSONObj.name)} // maybe get this by calling App.getProductNameByIdx( idx ) instead of storing it in obj to imporve memory usage
                qty={cartEntryJSONObj.qty}
                subtotal={cartEntryJSONObj.subtotal}
            />
        )
        });
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

export default CartTable;