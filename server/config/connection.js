const mongoose = require('mongoose');

mongoose.connect("mongodb+srv://kjustin03:Kyleyang12!@cluster0.mbc7g4j.mongodb.net/test", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

module.exports = mongoose.connection;
