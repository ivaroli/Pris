import React from "react";

import { updateList } from "./Products";

export class FilterValue extends React.Component{
    constructor(props){
        super(props);

        this.handleChange = this.handleChange.bind(this);
    }

    componentDidMount() {        
    }

    handleChange(event){
        console.log("change");
        
        if(event.target.checked){
            updateList(this.props.indices, true);
        }
        else{
            updateList(this.props.indices, false);
        }   
    }
    
    render(){
        return(
            <div className="checkbox">
                <label className="checkbox-container"> 
                    <input type="checkbox" value="" data-indices={this.props.indices} onChange={this.handleChange}/>
                    <span className="checkmark"></span>
                    <div className="checkbox-text">{ this.props.value.Value }</div>
                </label>
            </div>
        );
    }
}