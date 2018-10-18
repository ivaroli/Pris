// nær í gögnin úr node.js þjóninum
export function getData(query, callback)
{
    var obj = { product: query };
    console.log("posting about: " + obj);

   $.post("/app.js", obj, function(data){
       callback(data);
   });
}

// nær í gögnin úr node.js þjóninum
export function suggestionSearch(query, callback)
{
    var obj = { product: query };

   $.post("/search", obj, function(data){
       callback(data);
   });
}

//fer í gegnum gögnin og tekur út allt sem á ekki að vera þar
//td ef vara er ekki active
export function cleanData(data){
    var dataLength = Object.keys(data).length
    var temporaryData = data;

    for(var i = 0; i < dataLength; i++){
        if(data[i] == undefined){
            continue;
        }

        var item = data[i]._source;        

        if(item == undefined || item.active == false){
            temporaryData.splice(i, 1);
        }
    }

    return temporaryData;
}