
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
