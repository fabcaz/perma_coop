import React, { Component } from 'react'
import {ListGroup, Button, Dropdown, DropdownButton, NavDropdown, Nav, Navbar} from 'react-bootstrap'
import {ReactComponent as ShoppingCartIcon} from "./shopping_cart_white_24dp.svg"



class Navigbar extends Component {

    render(){


        return(
          <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
            <Navbar.Brand href="#home">FOOD Market</Navbar.Brand>
            <Navbar.Toggle aria-controls="responsive-navbar-nav" />
            <Navbar.Collapse id="responsive-navbar-nav">
            
              <Nav className="m-auto">
                <Navbar.Text className="m-auto">
                { this.props.account
                  ?
                <p className = "text-center text-white">active acct: {this.props.account}</p>
                  :
                  <p className = "text-left text-white">No account connected</p>
                }
                </Navbar.Text>                  
              </Nav>
              <Nav>
              <DropdownButton id="dropdown-basic-button" title={<ShoppingCartIcon/>} menuAlign="right">
                <Dropdown.Item href="#/action-1">Everything above divider should be product::qty/weight::$amount</Dropdown.Item>
                <Dropdown.Item href="#/action-2">Another action</Dropdown.Item>
                <Dropdown.Divider />
                <Dropdown.Item >
                <ListGroup horizontal>
                  <ListGroup.Item>Total: $XXX.xxx</ListGroup.Item>
                  <ListGroup.Item onClick={() => console.log}><Button href="#" className="m">Checkout</Button></ListGroup.Item>
                  
                </ListGroup>
                  
                </Dropdown.Item>
              </DropdownButton>
              </Nav>

            
            </Navbar.Collapse>
          </Navbar>
        )
    }


    
}
export default Navigbar;
