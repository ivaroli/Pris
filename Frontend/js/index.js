import React from "react";
import { render } from "react-dom";
import { IndexHeader } from "./components/IndexHeader";

function clearSuggestions(){
    console.log("typpi");
    
}

$(window).ready(function(){
    render(<IndexHeader/>, window.document.getElementById("head-container"));
});


$(document).ready(function(){
    $('.list-group-item').on("click", function(event){
        var query = event.target.innerText;
        query = query.replace(" ", "+");
        var url = "/results?product=" + query;

        window.location.href = url;  
    });
});