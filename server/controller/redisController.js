
var mongodbController = require('./mongoController.js');
var redis = require('../database/redis.js');
var jobQueue = require('../database/redisQueueInstance');

// Creates task to be put in the job queue
exports.queueWebsite = function(req, res) {
  var url = req.body.url;
  var numberOfTasks = 1;

  jobQueue.createTasks(url, numberOfTasks);
  res.status(200);
  res.json(jobQueue.jobID);
  jobQueue.jobID++;
}

// retrieves job from queue or DB
exports.retrieveJob = function(req, res) {
  var id = req.params.id;
  mongodbController.find(id, function(err, url){
    if (!url){
      retrieveJobPosition(id, function(pos){
      res.json({pos:pos});
      });
      return;
    }
      res.json(url);
  })
}
// retrieves job from redis queue
var retrieveJobPosition = function(id, callback) {
  var queuePosition = null;
  redis.llen(jobQueue.key, function(err, reply){
    if (err) {
      return `There was an error finding the length of the job queue ${err}` ;
    }
    redis.lrange(jobQueue.key, 0, reply, function(err, replies){
      if (replies) {
        for(var i = 0; i < replies.length; i++) {
          if (JSON.parse(replies[i])[0] == id) {
            queuePosition = i;
          }
        }
      }
      callback(queuePosition);
    });
  });
}
