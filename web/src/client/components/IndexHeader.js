import React from "react";
import { findDOMNode } from "react-dom";
import { SuggestionsField } from "./SuggestionsField";
import { suggestionSearch } from "../../logic/QueryHandler";

export class IndexHeader extends React.Component{
    constructor(props) {
        super(props);
        this.state = {value: ''};
    
        this.handleChange = this.handleChange.bind(this);
        this.handleClickOutside = this.handleClickOutside.bind(this);
    }

    componentDidMount() {
        document.addEventListener('click', this.handleClickOutside, true);
    }
    
    componentWillUnmount() {
        document.removeEventListener('click', this.handleClickOutside, true);
    }

    handleClickOutside(event){
        var componentChild = this.child;

        if (!$('#search_form').is(':hover')) {
            componentChild.update({});
        }
    }
    
    handleChange(event) {
        this.setState({value: event.target.value});
        var componentChild = this.child;

        suggestionSearch(event.target.value, function(result){
            result = JSON.parse(result);        
            
            var suggestions = [];
            var numOfItems = Object.keys(result.hits.hits).length;
            var num = (numOfItems >= 5)? 5 : numOfItems;

            for(var i = 0; i < num; i++){
                suggestions.push(result.hits.hits[i]._source.title);
            }

            componentChild.update(suggestions);
            
        });
    }

    render(){
        return(
            <div>
                <form id="search_form" action="results" method="get" autoComplete="off">
                    <div className="input-group" id="search-input">
                        <input type="text" className="form-control" id="product" placeholder="Sláðu inn nafn eða gerð vöru." name="product" onChange={this.handleChange} ></input>
                            <span className="input-group-addon">
                                <span className="glyphicon glyphicon-search"></span>
                            </span>
                    </div>
                </form>
                <SuggestionsField onRef={ref => (this.child = ref)}/>
            </div>
        );
    }
}