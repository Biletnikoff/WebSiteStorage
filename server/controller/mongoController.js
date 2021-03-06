var Website = require('../model/websiteSchema');

exports.createOne = function(url, id, content){
  var newWebsite =  new Website({ id: id, url: url, content: content });
  newWebsite.save(newWebsite, function(err, newWebsite){
    if (err){
      return err;
    }
    console.log('database entry created')
  });
}
exports.find = function(id, callback){
  Website.findOne({id: id}, function(err, website){
    if (err){
      return console.log('website cannot be found by JobId');
    }
     callback(err, website);
  });
}
