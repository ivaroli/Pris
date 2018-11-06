var express = require('express');
var app = express();
var path = require('path');
var url = require('url');
var fs = require('fs');
var bodyParser = require('body-parser');
var query_handeler = require("./query_handeler");

//staðsettning fyrir html síðurnar
var files = path.normalize("./Frontend/");

//logga allt sem gerist á síðunni
function log(text){
    fs.appendFile("./Server/logs/site_log.txt", text, function(err) {
        if(err) {
            return console.log(err);
        }
    });
}

//setup
app.use(bodyParser());
app.use('/', express.static(files));

app.listen(8888, function(){
  console.log("Server started...");
});

//handel-a index request ef þess þarf
app.get('/', function(req, resp){
  console.log("User entered the site by the ip: " + req.connection.remoteAddress);
  var d = new Date().toISOString();
  log("User entered the site by the ip: " + req.connection.remoteAddress + " - " + d + "\n");
  resp.sendFile('./html/index.html', {root: files});
});

//handelar allar aðrar GET request á file-a
app.get(/^(.+)$/, function(req, resp){
    var url_parts = url.parse(req.url, true);
    var file_type = path.extname(url_parts.pathname);
    var file = req.params[0];
    
    if(file_type == ".html" || file_type == ""){
        file = "/html" + file;

        if(file_type == ""){
            file += ".html"; 
        }
    }

    console.log(file);

    if(fs.existsSync(files+file))
    {
        resp.sendFile(file, {root: files});
    }
    else if(file_type == ".html" || file_type == ""){
        resp.sendFile('404.html', {root: "./Frontend/errors"});
    }
    else{
        resp.end();
    }
});

//handel-a result request, sem oftast fylgir query
app.post('/app.js', function(req, resp){
    console.log("User posted a query: " + req.body);

    var d = new Date().toISOString();
    log("IP " + req.connection.remoteAddress + " posted a query: " + req.body + " - " + d + "\n");
  
    var query = req.body;
  
    query_handeler.handle(query, function(es_response){
      resp.json(JSON.stringify(es_response));
      resp.end();
    });
});

//handel-a search request sem er í leitar bar... s.s. fyrir "suggestions"
app.post('/search', function(req, resp){
    var query = req.body;

    query_handeler.handleQuickSearch(query, function(es_response){
        resp.json(JSON.stringify(es_response));
        resp.end();
      });
});
