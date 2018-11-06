import React from "react";
import { render } from "react-dom";

import { FilterItem } from "./FilterItem";

const test_list = {filters: ["TEST", "TEST", "TEST", "TEST", "TEST", "TEST", "TEST", "TEST", "TEST", "TEST", "TEST"]};

export class FilterComponent extends React.Component{
    render(){
        console.log(this.props.Filters);
        

        if(this.props.Filters != undefined){
            return(
                <div className="filter-item">
                    { this.props.Filters.map((filter, index) => <FilterItem key={"filterContainer-" + index.toString()} Filter={filter} />) }
                </div>
            );
        }

        return(
            <div className="filtercomponent">
                <h3>No Filters Given</h3>
            </div>
        );
    }
}