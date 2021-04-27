import React, { Component } from 'react'
import {ListGroup, Button, Dropdown, DropdownButton} from 'react-bootstrap'
import {ReactComponent as ShoppingCartIcon} from "./shopping_cart_white_24dp.svg"
//import Web3 from 'web3'

import CartTable from './CartTable.js'

class CartDropdown extends Component{

    constructor(props){
        super(props);

        this.calculateTotalAmountDue = this.calculateTotalAmountDue.bind(this);
        this.handleClick = this.handleClick.bind(this);
    }

    async handleClick(){
        //this.props.checkout_func()
    }

    calculateTotalAmountDue(){
        let total = 0;
        //CartEntryJSONObj = {prod_idx: prod_idx, name: string, qty: number, subtotal: number}
        this.props.cart.forEach(CartEntryJSONObj => {
            total += CartEntryJSONObj.subtotal;
        });

        return total;
    }

    render(){
        return(
            <React.Fragment>
                <DropdownButton id="dropdown-basic-button" title={<ShoppingCartIcon/>} menuAlign="right">

                    <Dropdown.Item href="#/action-2">
                        <CartTable
                            className="table"
                            header={["name", "qty", "subtotal"]}
                            cart={this.props.cart}
                        />
                    </Dropdown.Item>

                    <Dropdown.Divider />                    
                    <Dropdown.Item >
                    <ListGroup horizontal>
                        <ListGroup.Item>Total: ${this.calculateTotalAmountDue()}</ListGroup.Item>

                        <ListGroup.Item onClick={() => console.log}>
                            <Button onClick={this.handleClick} className="m">Checkout</Button>
                        </ListGroup.Item>
                    </ListGroup>

                    </Dropdown.Item>
                </DropdownButton>
            </React.Fragment>

        )

    }
}
export default CartDropdown;