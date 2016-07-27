var Queue = require('../jobRunner/queue.js');
var redis = require('./redis.js');

// worker tasks execution instance
module.exports = new Queue('JobQueuer', redis);
