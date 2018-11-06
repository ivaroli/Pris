var elko = require('./drivers/elko.js');
var epli = require('./drivers/epli.js');
var macland = require('./drivers/macland.js');
var nova = require('./drivers/nova.js');
/*
setInterval(start, 300000);

function start(){
    elko.activate();
    epli.activate();
    macland.activate();
    nova.activate();
}*/

elko.activate();
    epli.activate();
    //macland.activate();
    nova.activate();