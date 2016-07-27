var mongodbController = require('../controller/mongoController');
var request = require('request');

// worker queue constructor
function Queue(key, client) {
  this.key = key;
  this.client = client;
  this.jobID = 0;
}

// pushes to redis client
Queue.prototype.push = function (data) {
  this.client.rpush(this.key, data, function(err, reply){
    if (err) {
      return console.log('Error pushing job to jobQueue in Redis');
    }
    return reply;
  });
};

// creates tasks to push jobs to redis
Queue.prototype.createTasks = function (url, content, numberOfTasks) {
  var job = [this.jobID, url];
  // pushes to redis
  this.push(JSON.stringify(job));

}

// downloads html from requested website
Queue.prototype.downloadWebsite = function(url, jobID, callback) {
  request(`http://${url}`, function(err, res, body){
    if (err) {
      return console.log('err'+ res.statuscode);
    }
    callback(url, jobID, body);
  });
};

//  removes job from the queue and sends to db
Queue.prototype.pop = function(callback) {
  this.client.lpop(this.key, function(err, reply) {
      if (err) {
        return console.log(err);
      }
       else if (reply) {
        var requestedURL = JSON.parse(reply);
        var jobID = requestedURL[0];
        var url = requestedURL[1];
        callback(url, jobID, mongodbController.createOne);
      }
  });
}


module.exports = Queue;
