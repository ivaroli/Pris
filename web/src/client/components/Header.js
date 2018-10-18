import React from "react";
import { SuggestionsField } from "./SuggestionsField";
import { suggestionSearch } from "../../logic/QueryHandler";

export class Header extends React.Component{
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
            <nav className="navbar navbar-light bg-light">
            <a className="navbar-brand" href="/"><img src="/images/logo_NT.png" alt="" width="80px" height="auto"></img></a>
            <div className="nav-container">
                <div className="container">
                    <form id="search_form" autoComplete="off">
                        <div className="input-group">
                            <input id="product-input" type="text" className="form-control" name="product-input" placeholder={this.props.Query} onChange={this.handleChange}></input>
                            <span className="input-group-addon"><i className="glyphicon glyphicon-search"></i></span>
                        </div>
                    </form>
                    <SuggestionsField onRef={ref => (this.child = ref)}/>
                </div>
            </div>
            </nav>
        );
    }
}