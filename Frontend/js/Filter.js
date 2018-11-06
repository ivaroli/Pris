import React from "react";
import { render } from "react-dom";

import { FilterComponent } from "./components/FilterComponent";

var data = {};
var filterData = { filters: [] };
var filterIsShown = false;

//start up á filterum, býr til og sér um þá alveg
export function CreateFilter(d){
    data = d;
    createFilterData();

    render(<FilterComponent Filters={ filterData.filters } />, window.document.getElementById("filters"));
}

//felur filter container-inn
export function HideFilters(){
    $("#filter-container").removeClass("open");
    $("#filter-container").addClass("closed");
    $(".overlay").removeClass("fadeIn");
    $(".overlay").addClass("fadeOut");
    $("#glyph").removeClass("glyphicon-menu-left");
    $("#glyph").addClass("glyphicon-menu-right");
    filterIsShown = false;
}

//sýnir filter container-inn
export function ShowFilters(){
    $("#filter-container").removeClass("closed");
    $("#filter-container").addClass("open");
    $(".overlay").removeClass("fadeOut");
    $(".overlay").addClass("fadeIn");
    $("#glyph").removeClass("glyphicon-menu-right");
    $("#glyph").addClass("glyphicon-menu-left");
    filterIsShown = true;
}

export function GetFilterStatus(){
    return filterIsShown;
}

//Býr til JSON object sem er þæginlegt að nota í filterum
function createFilterData(){
    var dataLength = Object.keys(data).length

    for(var i = 0; i < dataLength; i++){
        if(data[i]._source.information == undefined || Object.keys(data[i]._source.information).length <= 0){
            continue;
        }

        //laga info, það er stundum information.information... í stað information...
        if(data[i]._source.information.information != undefined){
            data[i]._source.information = data[i]._source.information.information;
        }

        var item = data[i]._source;
        var informationLength = Object.keys(item.information).length;

        for(var j = 0; j < informationLength; j++){
            var infoName = item.information[j].name;
            var infoValue = item.information[j].data;
            
            insertFilterItem(infoName.trim(), infoValue.trim(), i);
        }
    }
}

function insertFilterValue(obj, value, index){
    var propertiesLength = Object.keys(obj.Properties).length;

    for(var i = 0; i < propertiesLength; i++){
        if(obj.Properties[i].Value == value){
            if(obj.Properties[i].Indices == undefined){
                obj.Properties[i].push({Indices: [index]});
                return;
            }
            
            obj.Properties[i].Indices.push(index);
            return;
        }
    }

    var new_prop = {
        Value: value,
        Indices: [index]
    };
    obj.Properties.push(new_prop);
}

// býr til eða raðar filter object útfrá vöru
function insertFilterItem(name, value, index){
    var filterLength = Object.keys(filterData.filters).length;
    var obj = {
        Name: name,
        Properties:[
        {
            Value: value,
            Indices: [index]
        }]
    };

    if(Object.keys(filterData.filters).length == 0){
        filterData.filters.push(obj);
        return;
    }

    for(var i = 0; i < filterLength; i++){
        if(filterData.filters[i].Name == name){
            insertFilterValue(filterData.filters[i], value, index);
            return;
        }
    }

    filterData.filters.push(obj);
}