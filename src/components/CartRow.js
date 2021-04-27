import React, { Component } from 'react'
//const util = require('util');
class CartRow extends Component{

    render(){        
        return(            
            <tr key={this.props.idx} >
                <td>{this.props.name}</td>                
                <td>{this.props.qty}</td>
                <td>{this.props.subtotal}</td>
            </tr>            
        )
    }
}


export default CartRow;