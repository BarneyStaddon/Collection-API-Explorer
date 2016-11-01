//utils.js

var http = require("http");
var https = require("https");


/**
 * getJSON:  REST get request returning JSON object(s)
 * @param options: http options object
 * @param cb: callback to pass the results JSON object(s) back
 */
exports.getJSON = (options,cb) => {  
	
	console.log("running getJSON");

	var prot = options.port == 443 ? https : http; //use 80

	var req = prot.request(options, function(res)
    {
        var data = '';
        
        res.setEncoding('utf8');

        res.on('data', (chunk) => {
            	data += chunk;
        });

        res.on('end', () => {
            var obj = JSON.parse(data);
            cb(res.statusCode, obj);
        });

    });

    req.on('error', (e) => {
        //res.send('error: ' + err.message);
    });

    req.end();

	//return { messages: ['test1', 'test2', 'test3', 'test4', 'test5', cb]  };
};  