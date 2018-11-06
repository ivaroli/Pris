import React from "react";
import { render } from "react-dom";
import { unmountComponentAtNode } from "react-dom";
import { Suggestion } from "./Suggestion"

export class SuggestionsField extends React.Component{
    constructor(props){
        super(props);

        this.handleClick = this.handleClick.bind(this);
    }

    componentDidMount() {
        this.props.onRef(this)
    }
    
    componentWillUnmount() {
        this.props.onRef(undefined)
    }

    handleClick(event){
        event.preventDefault();
        console.log("asdf");        
    }

    update(data){
        unmountComponentAtNode(window.document.getElementById("productList"));

        if(Object.keys(data).length > 0){
            console.log(typeof data[0] + " + " + typeof data);
            
            var children = 0;
            var child = <ul className="suggestion-list">{ data.map((product,index) => <Suggestion data={data[index]} key={"item-"+index}/>)}</ul>;
            render(child, window.document.getElementById("productList"));
        }
    }

    render(){
        return(
            <div id="productList"></div>
        );
    }
}