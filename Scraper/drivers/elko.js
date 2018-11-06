var client = require('../elastic_client.js');
var classifier = require('../classifier.js');
var request = require("request");
var cheerio = require("cheerio");

var absolute_links = ["https://elko.is/hljod-og-mynd/sjonvorp", "https://elko.is/simar-og-gps/farsimar?new=desc"];

module.exports.activate = function(){
  for(var i = 0; i < absolute_links.length; i++){
    start(absolute_links[i]);
  }
}

function get_html(link, callback){
  request({
    uri: link,
    }, function(error, response, body) {
      console.log(error);
      callback(body);
  });
}

function start(link){
  get_html(link, function(body){
    var $ = cheerio.load(body);
    console.log("5");

    $('.product-title > a').each(function() {
      var link = $(this);
      var text = link.text();
      var href = link.attr("href");
      console.log("Sending link: " + href);
      product_scrape(href);
      console.log("6");
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

function orginize_features(str, $){
  features = $(str);
  var act_freatures = {information:[]};
  var new_feature = true;
  var object = {};

  features.each(function(){
    if(new_feature){
      new_feature = false;
      object = {
        name: replace_all($(this).text(), '\n', ''),
        data : ""
      };
    }
    else{
      new_feature = true;
      object.data = replace_all($(this).text(), '\n', '');
      act_freatures.information.push(object);
    }
  });

  return act_freatures;
}

function product_scrape(link){
  get_html(link, function(body){
    if(typeof body == 'undefined'){
      console.log("Cannot scrape " + link);
      return;
    }

    var $ = cheerio.load(body, {normalizeWhitespace: true});

    var title = $('h1.product-title').text().replace('\n', '');
    var price = $('.price').text();
    var img = $('.product-big-image > div > img').attr("src");
    var features = orginize_features('.feature-div > .table > tbody > tr > td:not(.td-head)', $);

    classifier.parse_title(title, function(new_title){
      var obj = createObject(new_title, parsePrice(price), img, "{}", link, features);
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

function createObject(_title, _price, _img, _labels, _link, _features){
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
    information : _features
  }

  return obj;
}
