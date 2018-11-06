var elasticsearch = require('elasticsearch');

/*var client = new elasticsearch.Client({
  host: 'localhost:9200',
  log: [{
    type: 'file',
    level: 'error',
    path: './Server/logs/elastic_error_log.txt'
  },
  {
    type: 'file',
    level: 'info',
    path: './Server/logs/elastic_query_log.txt'
  }]
});
*/

var client = new elasticsearch.Client({ log: ['error', 'trace'] });

function find_types(query_string, callback)
{
  client.search({
    index: 'prices',
    type: 'products',
    body: {
      size:1000,
      query: {
        bool:{
          should:[
            {match:{lables:query_string}},
            {match:{category:query_string}}
          ]
        }
      }
    }
  }).then(function (resp) {
    callback(resp);
  }, function (err) {
    console.trace(err.message);
    callback({});
  });
}

module.exports.handle = function (query, callback) {
    var query_string = query.product;

    client.search({
      index: 'prices',
      type: 'products',
      body: {
        size:1000,
        query: {
          bool:{
            must:{
              match:{
                title:query_string
              }
            },
            must_not:{match:{active:false}}
          }
        }
      }
    }).then(function (resp) {
      if(resp.hits.total != 0){
          console.log(resp);
          callback(resp);
      }
      else{
        find_types(query_string, function(second_resp){
          console.log(second_resp);
          callback(second_resp);
        });
      }
    }, function (err) {
      console.trace(err.message);
      callback({});
    });
};

module.exports.handleQuickSearch = function (query, callback) {
  var query_string = query.product;

  client.search({
    index: 'prices',
    type: 'products',
    body: {
      size:5,
      query: {
        bool:{
          should:{
            regexp:{
              title:".*"+query_string+".*"
            }
          },
          must_not:{match:{active:false}}
        }
      }
    }
  }).then(function (resp) {
    callback(resp);
  }, function (err) {
    console.trace(err.message);
    callback({});
  });
};
