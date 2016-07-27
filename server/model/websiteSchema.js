var mongoose = require('mongoose');

var websiteSchema = new mongoose.Schema({
    url: String,
    content: String,
    id: String,
})
// model is always single
var Website = mongoose.model('websiteStorage', websiteSchema);

module.exports = Website;
