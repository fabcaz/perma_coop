import React, { Component } from 'react'
import {Nav, Navbar} from 'react-bootstrap'

//const util = require('util');

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
              {this.props.cartDropdown}
            </Nav>

          
          </Navbar.Collapse>
        </Navbar>
      )
  }
}
export default Navigbar;
