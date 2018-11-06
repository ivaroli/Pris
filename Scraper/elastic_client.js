var elasticsearch = require('elasticsearch');

var client = new elasticsearch.Client({
  host: 'localhost:9200'
});

module.exports.insert = function (data){
  has_link(data.link, function(link){
    if(JSON.stringify(link) != '{}'){
      console.log(JSON.stringify(link));

      if(has_change(data, link)){
        update(data, link);
      }
    }
    else{
      act_insert(data);
    }
  });
}

function act_insert(data){
  client.index({
  index: 'prices',
  type: 'products',
  body: data
},function(err,resp,status) {
    console.log(resp);
});
}

function has_link(l, callback){
  var ret_id = client.search({
    index: 'prices',
    type: 'products',
    body: {
      query: {
        bool : {
          must : {
            match : { link : l }
          }
        }
      }
    }
  }).then(function (resp) {
    var hits = resp.hits.hits;

    if(resp.hits.total > 0 ){
      var max_version = 0;
      var wanted_index = 0;
      var has_found = false;

      for(var i = 0; i < hits.length; i++){
          if(hits[i]._source.link == l && hits[i]._source.version > max_version){
            max_version = hits[i]._source.version;
            wanted_index = i;
            has_found = true;
          }
      }

      if(has_found){
        callback(hits[wanted_index]);
      }
      else{
        callback({});
      }
    }
    else{
      callback({});
    }
  }, function (err) {
    console.trace(err.message);
    callback({});
  });
}

function has_change(data, db_data){
  if(data.image == db_data._source.image &&
     data.price == db_data._source.price){
    return false;
  }
  return true;
}

function update(data, db_data){
  delete_from_id(db_data._id);
  var new_data = db_data._source;
  new_data.active = false;
  data.version++;

  act_insert(new_data);
  act_insert(data);
}

function delete_from_id(id){
  client.deleteByQuery({
        index: 'prices',
        type: 'products',
        body: {
          query: {
            bool : {
              must : {
                match : { _id : id }
              }
            }
          }
        }
    }, function (error, response) {
        console.log(JSON.stringify(error));
        console.log("Deleted");
    });
}

function get_from_id(id){
  client.search({
    index: 'prices',
    type: 'products',
    body: {
      query: {
        bool : {
          must : {
            match : { _id : id }
          },
          minimum_should_match : 1,
          boost : 1.0
        }
      }
    }
  }).then(function (resp) {
    var hits = resp.hits.hits;

    if(hits.length > 0 ){
      return hits[0];
    }
    else{
      return {};
    }
  }, function (err) {
    console.trace(err.message);
  });
}
