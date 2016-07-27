var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var schedule = require('node-schedule');
var app = express();
var port = process.env.PORT || 8080;
var dbUri = process.env.MONGOLAB_URI || 'mongodb://localhost/mydb';
var redisController = require('./controller/redisController');
var routes = require('./routes/websiteStorageRouter.js');
var jobQueue = require('./database/redisQueueInstance');

//WORKER
var worker = schedule.scheduleJob('*/15 * * * * *', function(){
  console.log("in the scheduler");
   jobQueue.pop(jobQueue.downloadWebsite);
});
worker.schedule();

//MONGODB
mongoose.connect(dbUri);

app.use(express.static(__dirname+'/../client/'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.listen(port, function(err){
  if (err) {
    console.log('Err, server unable to connect');
  }
  console.log(`Magic happening on port: ${port}`);
})

//ROUTES
require('./routes/websiteStorageRouter.js')(app, express);

module.exports = app;
