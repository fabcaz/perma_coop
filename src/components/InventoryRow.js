import React, { Component } from 'react'
const util = require('util');
class InventoryRow extends Component{

    constructor(props){
        super(props);
        this.state={
            value: 0,
        }
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    handleSubmit = e => {
        e.preventDefault()        
        
        // console.log("props:" + util.inspect(this.props));        
        // console.log("SUBMIT: " + this.state.value)
        // console.log("idx: "+this.props.idx)
        
        this.props.updateCartEntry_func(this.props.idx, this.state.value);        
    }

    handleChange = e =>{
        const {name, value} = e.target;
        console.log("CHANGE : " + value)
        
        console.log("props:" + util.inspect(this.props));
                
        e.preventDefault();
        this.setState({
            value
        });
    }

    render(){        
        return(            
            <tr key={this.props.idx} >
                <td>{this.props.name}</td>
                <td>{this.props.price}</td>
                <td>{this.props.qty}</td>
                <td>
                    <form onSubmit={this.handleSubmit} >
                        <input //className="input-group"
                        name="updateCartEntry"
                        type="number"
                        placeholder={this.state.value}
                        value={this.state.value}
                        min={0}
                        max={this.props.qty}
                        onChange={this.handleChange}
                        />
                        <input type="submit" value="submit" />
                    </form>
                </td>
                
            </tr>            
        )
    }
}


export default InventoryRow;