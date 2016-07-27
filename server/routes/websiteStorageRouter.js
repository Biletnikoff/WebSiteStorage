module.exports = function(redisRouter, express){
  var redisController = require('../controller/redisController.js');

  redisRouter.route('/submitredis')
             .post(redisController.queueWebsite);

  redisRouter.route('/getwebsite/:id')
             .get(redisController.retrieveJob);


};
