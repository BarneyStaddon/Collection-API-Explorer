/**
 * This file provided by Facebook is for non-commercial testing and evaluation
 * purposes only. Facebook reserves all rights not expressly granted.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL
 * FACEBOOK BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN
 * ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
 * WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

 "use strict";

var fs = require('fs');
var path = require('path'); //node core mod https://nodejs.org/api/path.html
var express = require('express'); //node framework
var bodyParser = require('body-parser'); //helps pull post content from http requests
var app = express(); //define app using express
var utils = require('./utils');

//__dirname global of directory this script runs from 
//path.join creates a path string out of all values passed in
var COMMENTS_FILE = path.join(__dirname, 'comments.json');

//set the port
app.set('port', (process.env.PORT || 3000));


//N.B 'use' binds middleware - http://expressjs.com/en/guide/using-middleware.html
//http://expressjs.com/en/guide/writing-middleware.html

//create a virtual path (where the path does not actually exist in the file system) for serving static assets directly in the app
//Express docs state this as 'specify a mount path' 
// '/' + __dirname + '/' public 
app.use('/', express.static(path.join(__dirname, 'public')));
//this lets us get the body from a post
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

//middleware function which will set headers that we need on each request.
//the 'use' method loads it into the app. N.B Every time the app receives a request, it runs this function
//The order of 'loaded' methods is important. Middleware functions that are loaded first are also executed first
//If we put this after the http methods below, it would never be run because the route handlers would terminate the request response cycle
//So, because this function would also terminate the request response cycle, we call next()
//In effect this passes on the request to the next middleware function in the stack   
app.use(function(req, res, next) {
	// Set permissive CORS header - this allows this server to be used only as
	// an API server in conjunction with something like webpack-dev-server.
	res.setHeader('Access-Control-Allow-Origin', '*');

	// Disable caching so we'll always get the latest comments.
	res.setHeader('Cache-Control', 'no-cache');
	
	//If the current middleware function does not end the request-response cycle, 
	//it must call next() to pass control to the next middleware function. Otherwise, the request will be left hanging.
	next();
});

//on a get request
app.get('/api/comments', function(req, res) {
  	
	//read the file
  	fs.readFile(COMMENTS_FILE, function(err, data) {
		
		//handle any errors
		if (err) {
	  		console.error(err);
	  		process.exit(1);
		}

		//send the response as json
		res.json(JSON.parse(data));
  	});
});


//on a post request
app.post('/api/search', function(req, res) {


	console.log('search endpont term: ' + req.body.term);

	//var term = req.body.term;

	//res.json(req.body);
	let apiHost = 'fe01.museumoflondon.org.uk';
	let params = '';
	let facetFields = ['section', 'makerString', 'borough', 'currentLocation'];
	let objectSearchParams = `?json.nl=map&q=(idNumber:(${req.body.term}))+OR+(primaryTitle:(${req.body.term})%5E5+OR+text:(${req.body.term}))+AND+type:("object")+AND+-type:("context+item")+AND+type:("object")&rows=30&start=0&wt=json`; 
	let facetParams = `?facet=true&facet.field=${facetFields[0]}&facet.limit=-1&facet.mincount=1&json.nl=map&q=(idNumber:(${req.body.term}))+OR+(primaryTitle:(${req.body.term})%5E5+OR+text:(${req.body.term}))+AND+type:(%22object%22)+AND+-type:(%22context+item%22)+AND+type:(%22object%22)&rows=0&start=0&wt=json`;
	
	//section (Section) facet select?facet=true&facet.field=section&facet.limit=-1&facet.mincount=1&json.nl=map&q=(idNumber:(coins))+OR+(primaryTitle:(coins)%5E5+OR+text:(coins))+AND+type:(%22object%22)+AND+-type:(%22context+item%22)+AND+type:(%22object%22)&rows=0&start=0&wt=json
	//maker (Artist maker) facet select?facet=true&facet.field=makerString&facet.limit=-1&facet.mincount=1&json.nl=map&q=(idNumber:(coins))+OR+(primaryTitle:(coins)%5E5+OR+text:(coins))+AND+type:(%22object%22)+AND+-type:(%22context+item%22)+AND+type:(%22object%22)&rows=0&start=0&wt=json
	//borough (place) facet select?facet=true&facet.field=borough&facet.limit=-1&facet.mincount=1&json.nl=map&q=(idNumber:(coins))+OR+(primaryTitle:(coins)%5E5+OR+text:(coins))+AND+type:(%22object%22)+AND+-type:(%22context+item%22)+AND+type:(%22object%22)&rows=0&start=0&wt=json
	//location (location) facet select?facet=true&facet.field=currentLocation&facet.limit=-1&facet.mincount=1&json.nl=map&q=(idNumber:(coins))+OR+(primaryTitle:(coins)%5E5+OR+text:(coins))+AND+type:(%22object%22)+AND+-type:(%22context+item%22)+AND+type:(%22object%22)&rows=0&start=0&wt=json

	//params = objectSearchParams;
	params = facetParams;


	// options for GET
	let options = {
    	host : apiHost, // here only the domain name
    	// (no http/https !)
    	port : 80,
    	path : '/solr/mol/select' + params,
    	method : 'GET', // do GET
    	headers: {
        	'Content-Type': 'application/json'
    	}
	};

	// pass options and a callback to handle the result
	utils.getJSON(options, (statusCode, result) => {

		console.log("statusCode:" + statusCode);
		//return { result : result };
		//res.render('pages/index', { results : result.response.docs });

		res.json({ results : result.response.numFound });

	});

});


//on a post request
app.post('/api/comments', function(req, res) {
  	
	//read the file
  	fs.readFile(COMMENTS_FILE, function(err, data) {
	
		if (err) {
		  console.error(err);
		  process.exit(1);
		}
		
		//get our comments from the file as json
		var comments = JSON.parse(data);
		// NOTE: In a real implementation, we would likely rely on a database or
		// some other approach (e.g. UUIDs) to ensure a globally unique id. We'll
		// treat Date.now() as unique-enough for our purposes.
		
		//create our comment from the body
		var newComment = {
		  	id: Date.now(),
		  	author: req.body.author,
		  	text: req.body.text,
		};

		//add it to the array
		comments.push(newComment);
			
			//write our comment to the file, null stringfy modifier, add a 4 char space 
			fs.writeFile(COMMENTS_FILE, JSON.stringify(comments, null, 4), function(err) {
		  		//handle any error
		  		if (err) {
					console.error(err);
					process.exit(1);
		  		}
		  		//send our updated json to the browser
		  		res.json(comments);
			});
	  });
});


app.listen(app.get('port'), function() {
	console.log('Server started: http://localhost:' + app.get('port') + '/');
});