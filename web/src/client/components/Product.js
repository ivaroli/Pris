import React from "react";
import { render } from "react-dom";


export class Product extends React.Component{
    render(){
        var name = this.props.Data._source.title;
        var price = this.props.Data._source.price;
        var img = this.props.Data._source.image;
        var link = this.props.Data._source.link;

        return(
            <div className="row product-container component">
                <div className="col-md-2 product-image">
                    <img srcSet={(img != "" && img != undefined)?img : "Undefined Product"}  width="200px" height="200px"></img>
                </div>
                <div className="col-md-10">
                    <div className="row product-container">
                        <div className="col-md-6">
                            <h1 className="item-title">{(name != "" && name != undefined)?name : "Undefined Product"}</h1>
                            <h3 className="item-price">{(price != "" && price != undefined)?price + " ISK" : "Undefined Price"}</h3>
                            <small className="item-link">{(link != "" && link != undefined)?link : "Undefined Link"}</small>
                        </div>
                        <div className="col-md-3 product-button-container">
                            <span className="glyphicon glyphicon-heart product-button"></span>
                        </div>
                        <div className="col-md-3 product-button-container">
                        <a href={(link != "" && link != undefined)?link : "#"} target="_blank"><span className="glyphicon glyphicon-log-in product-button"></span></a>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}