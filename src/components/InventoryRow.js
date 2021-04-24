import React, { Component } from 'react'

class InventoryRow extends Component{


    render(){
        return(            
            <tr key={this.props.idx} >
                <td>{this.props.name}</td>
                <td>{this.props.price}</td>
                <td>{this.props.qty}</td>
                <td>onclick mutate array[{this.props.idx}] qty
                 and create/mutate entry in cart</td>
            </tr>            
        )
    }
}

export default InventoryRow;