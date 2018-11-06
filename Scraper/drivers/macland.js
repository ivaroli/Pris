var client = require('../elastic_client.js');
var classifier = require('../classifier.js');
var request = require("request");
var cheerio = require("cheerio");

var absolute_links = ["https://macland.is/flokkur/iphone/"];

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

    $('.woocommerce-loop-product__link').each(function() {
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

function getPrice($){
  var priceElem = $('.variations_form');
  var priceJson = JSON.parse(priceElem.attr("data-product_variations"));
  return priceJson;
}

function product_scrape(link){
  get_html(link, function(body){
    if(typeof body == 'undefined'){
      console.log("Cannot scrape " + link);
      return;
    }

    var $ = cheerio.load(body, {normalizeWhitespace: true});
    var img = $('.woocommerce-product-gallery__image > a > img').attr("src");

    /*classifier.label(img, function(labels){
      var title = $('.product_title').text().replace('\n', '');
      var prices = getPrice($);

      var sizesDone = [];
      var prices_length = prices.length;

      for(var i = 0; i < prices_length; i++){
        var price = prices[i].display_price;
        var size = prices[i].attributes.attribute_pa_geymsluplass;
        size = size.replace("gb", "GB");

        if(!sizesDone.includes(size)){
          var obj = createObject(title + " " + size, parseInt(price), img, labels, link);
          console.log("Inserted: " + title + " " + size);
          sizesDone.push(size);

          client.insert(obj);
        }
      }
    });*/

    var title = $('.product_title').text().replace('\n', '');
      var prices = getPrice($);

      var sizesDone = [];
      var prices_length = prices.length;

      for(var i = 0; i < prices_length; i++){
        var price = prices[i].display_price;
        var size = prices[i].attributes.attribute_pa_geymsluplass;
        size = size.replace("gb", "GB");

        if(!sizesDone.includes(size)){
          var obj = createObject(new_title, parsePrice(price), img, "{}", link, []);
          console.log("Inserted: " + title + " " + size);
          sizesDone.push(size);

          client.insert(obj);
        }
      }
  });
}

function createObject(_title, _price, _img, _labels, _link){
  var obj = {
    title : _title,
    price : _price,
    image : _img,
    link : _link,
    lables : _labels,
    clicks : 0,
    version : 1,
    active : true,
    information : [{name:"Framleiðandi", data :"Apple"}]
  }

  return obj;
}
