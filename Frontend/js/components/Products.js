import React from "react";
import { render } from "react-dom";

import { SearchSlider } from "./SearchSlider";
import { Product } from "./Product";

var shownIndices = [];
var items = [];
var showingFilters = false;
var data;

//deletes the difference between the objects
//a is the array that changes
function deltaData(a, b){
    var ret = a;

    for(var i = 0; i < Object.keys(a).length; i++){
        for(var j = 0; j < Object.keys(b).length; j++){
            if(a[i] == b[j]){
                ret.splice(i, 1);
            }
        }
    }

    return ret;
}

export function updateList(changedIndices, insert){
    /*for(var i = 0; i < Object.keys(changedIndices).length; i++){
        if(shownIndices.includes(changedIndices[i])){
            if(insert){
                changedIndices.splice(i, 1);
            }
            else{
                var j = shownIndices.find(function(item){return item==changedIndices[i];});
                console.log("removing: " + j);
                
                shownIndices.splice(j, 1);
            }
        }
    }*/

    if(insert){
        changedIndices = deltaData(changedIndices, shownIndices);
        Array.prototype.push.apply(shownIndices, changedIndices);
    }
    else{
        shownIndices = deltaData(shownIndices, changedIndices);
    }
    items =[];

    for(var i = 0; i < Object.keys(shownIndices).length; i++){
        console.log("Pushing: " + data[shownIndices[i]]);
        
        items.push(data[shownIndices[i]]);
    }

    console.log(items);
    
}

export class Products extends React.Component{
    constructor(props){
        super(props);

        data = this.props.Data;
        this.update = this.update.bind(this);

        document.getElementById('filter-button').addEventListener("click", this.update);
    }

    update(){
        console.log("filter update");

        if(showingFilters){
            showingFilters = false;
            this.forceUpdate();
        }
        else{
            showingFilters = true;
        }
    }

    componentDidMount() {
        console.log(this.items);

        $('#price-slider').slider({
            formatter: function(value) {
                return 'Current value: ' + value;
            }
        });
    }

    render(){
        console.log("rendering");
        
        try{
            if(Object.keys(this.props.Data).length <= 0){
                return(
                    <div className="container">
                        <h1 className="header-text">No Products To Show</h1>
                    </div>
                );
            }

            return(
                <div className="container">
                    {/*if items is empty then render normally else render only everything in items*/}
                    {(Object.keys(items).length == 0)? this.props.Data.map((product, index) => <Product key={"Product-" + index.toString()} Data={product} />) 
                    : items.map((product, index) => <Product key={"Product-" + index.toString()} Data={product} />)}
                </div>
            );
        }
        catch(e){
            console.log("Products error");
            console.error(e);
            
            return(null);
        }
    }
}

/*<div className="row price-row component" id="selection-row">
                        <div className="col-md-10">
                            <b>€ 10</b> <input id="price-slider" type="text" className="span2" value="" data-slider-min="10" data-slider-max="1000" data-slider-step="5" data-slider-value="[250,450]"/> <b>€ 1000</b>
                        </div>
                        <div className="col-md-2">
                            <b>Order By:</b>
                            <select className="form-control" id="order-selection">
                                <option>1</option>
                                <option>2</option>
                                <option>3</option>
                                <option>4</option>
                                <option>5</option>
                            </select>
                        </div>
                    </div>*/
