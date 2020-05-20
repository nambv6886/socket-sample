var client = require('./connector.js');

client.indices.delete({index: 'chatchit'},function(err,resp) {  
  console.log("delete",resp);
});
