
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


/*
const urls= [
  "http://localhost:3010/alm/build_tool",
  "http://localhost:3010/alm/development_tool",
  "http://localhost:3010/alm/project_architecture"
];
*/

/*

async.map(urls, httpGet, function (err, res){
  if (err) return console.log(err);
  console.log(res);
});

*/

//utils.js

/*

"use strict";

var http = require("http");
var https = require("https");
var resultCallback;
var responseHandler = function(res){
        
    var data = '';
    
    res.setEncoding('utf8');
    res.on('data', (chunk) => {
        data += chunk;
    });

    res.on('end', () => {
        var obj = JSON.parse(data);
        resultCallback(res.statusCode, obj);
    });
}

*/


/**
 * getJSON:  REST get request returning JSON object(s)
 * @param options: http options object
 * @param cb: callback to pass the results JSON object(s) back
 */

/*

exports.getJSON = (options,cb) => {  

	let prot = options.port == 443 ? https : http,
    req;

    resultCallback = cb;
    req = prot.request(options,responseHandler);

    req.on('error', (e) => {
        //res.send('error: ' + err.message);
    });

    req.end();
};

*/  