import React from "react";

export class Suggestion extends React.Component{
    constructor(props){
        super(props);

        this.handleClick = this.handleClick.bind(this);
    }

    handleClick(event){
        event.preventDefault();
        console.log("event fired");

        var query = event.target.innerText;
        query = query.replace(" ", "+");
        var url = "/results?product=" + query;

        window.location.href = url;     
    }

    render(){
        return(
            <li onMouseDown={this.handleClick} className="suggestion">{this.props.data}</li>
        );
    }
}