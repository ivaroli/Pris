const vision = require('@google-cloud/vision');
const googleTranslate = require('google-translate')('AIzaSyAH01uLWZqgt1zfyXhVfCeVQdsOkIGHot4');
const client = new vision.ImageAnnotatorClient();

// Performs label detection on the image file
module.exports.label = function(img, callback){
  client
  .labelDetection('https://elko.is/media/catalog/product/cache/1/image/9df78eab33525d08d6e5fb8d27136e95/s/c/sc1230e.jpg')
  .then(results => {
    const labels = results[0].labelAnnotations;
    var label_desc = [];

    labels.forEach(label => label_desc.push(label.description));

    translateArray(label_desc, function(new_labels){
      callback(new_labels);
    });
  })
  .catch(err => {
    console.error('ERROR:', err);
  });
}

function translateArray(strings, callback){
  googleTranslate.translate(strings, 'is', function(err, translation) {
    if(typeof(translation) != "undefined"){
      for(var i = 0; i < translation.length; i++){
        strings.push(translation[i].translatedText);
      }
    }
    callback(strings);
  });
}

module.exports.parse_title = function(title, callback){
  var strings = title.split(' ');
  CheckWords(strings, 0, strings[0], "", function(ret){
    callback(ret);
  });
}

function CheckWords(strings, index, word, current, callback){
  googleTranslate.detectLanguage(word, function(err, detection) {
    index++;
    try{
      if(detection.language != "is" &&
        (word.length > 1 || word.match(/^([a-z0-9A-Z\+]*)$/))){
        current += word + " ";
      }
      if(index == strings.length - 1){
        callback(current);
      }
      else{
        CheckWords(strings, index, strings[index], current, callback);
      }
    }
    catch(err){
      current += word + " ";
      if(index == strings.length - 1){
        callback(current);
      }
      else{
        CheckWords(strings, index, strings[index], current, callback);
      }
    }
  });
}
