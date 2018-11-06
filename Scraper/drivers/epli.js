var client = require('../elastic_client.js');
var classifier = require('../classifier.js');
var request = require("request");
var cheerio = require("cheerio");

var absolute_links = ["https://www.epli.is/iphone.html"];

module.exports.activate = function(){
  for(var i = 0; i < absolute_links.length; i++){
    start(absolute_links[i]);
  }
}

function get_html(link, callback){
  request({
    uri: link,
    }, function(error, response, body) {
      callback(body);
  });
}

function start(link){
  get_html(link, function(body){
    var $ = cheerio.load(body);

    $('.product-name > a').each(function() {
      var link = $(this);
      var text = link.text();
      var href = link.attr("href");
      console.log("Sending link: " + href);
      product_scrape(href);
    });
  });
}

function replace_all(str, find, replace) {
    return str.replace(new RegExp(find, 'g'), replace);
}

function parsePrice(price){
  var act_price = "";
  for(var i = 0; i < price.length; i++){
    if(!isNaN(price[i])){
      act_price+=price[i];
    }
  }
  return parseInt(act_price);
}

function product_scrape(link){
  get_html(link, function(body){
    if(typeof body == 'undefined'){
      console.log("Cannot scrape " + link);
      return;
    }

    var $ = cheerio.load(body, {normalizeWhitespace: true});

    var title = $('.product-name > h2').text().replace('\n', '');
    var price = $('.product-shop > .price-box > .regular-price > .price').text();
    var img = $('#image').attr("src");

    classifier.parse_title(title, function(new_title){
      var obj = createObject(new_title, parsePrice(price), img, "{}", link, []);
      console.log("Inserted " + new_title);
      client.insert(obj);
      /*classifier.label(img, function(labels){
        var obj = createObject(new_title, parsePrice(price), img, labels, link, features);
        console.log("Inserted " + new_title);
        client.insert(obj);
      });*/
    });
  });
}

function createObject(_title, _price, _img, _labels, _link){
  var obj = {
    title : _title,
    price : _price,
    image : _img,
    link : _link,
    lables : _labels,
    category : "snjallsímar snjallsími sími",
    clicks : 0,
    version : 1,
    active : true,
    information : [{name:"Framleiðandi", data :"Apple"}]
  }

  return obj;
}
