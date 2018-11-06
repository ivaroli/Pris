import React from "react";
import { render } from "react-dom";

import { Products } from "./components/Products";

//Sér um að update-a skjáinn samkvæmt filterum
export function DisplayData(data){
    render(<Products Data={ data } />, window.document.getElementById("products"));
}