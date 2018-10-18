import React from "react";

import { FilterValue } from "./FilterValue";

export class FilterItem extends React.Component{
    render(){
        if(this.props.Filter == undefined){
            return(
                <div className="checkbox">
                    <label> <input type="checkbox" value=""/> Test Item </label>
                </div>
            );
        }
        else{
            return(
                <div>
                    <h3>{ this.props.Filter.Name }</h3>
                    { this.props.Filter.Properties.map((value, index) => <FilterValue key={"filter-" + index.toString()} value={value} indices={this.props.Filter.Properties[index].Indices}/>) }
                </div>
            );
        }
    }
}