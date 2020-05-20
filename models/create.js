var client = require('./connector.js');

client.indices.create({  
  index: 'chatchit'
},function(err,resp) {
  if(err) {
    console.log(err);
  }
  else {
    console.log("create",resp);
  }
});