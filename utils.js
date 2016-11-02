//utils.js

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


/**
 * getJSON:  REST get request returning JSON object(s)
 * @param options: http options object
 * @param cb: callback to pass the results JSON object(s) back
 */
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