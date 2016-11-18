
//N.B can't use ES6 import, not yet implemented - to do so use webpack  
const request = require('request');

exports.getJSON = (url, callback) => {
  
  const options = {
    url :  url,
    json : true
  };
  
  request(options,
    function(err, res, body) {
      callback(err, body);
    }
  );
}
