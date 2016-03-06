/*!
 * easy-web-gui
 * Copyright(c) 2016 ma-ha
 * MIT Licensed
 */

var gui = exports = module.exports = { pages:{} }; 

// use express for REST services
var express = require('express');
var webservices = express();


/** Initialize the Web GUI*/
gui.init = function init( port ) {
	console.log("init()");
	this.setDefaults();

	var wsPort = port || 8888;
	webservices.listen( wsPort );
	
	console.log( 'GUI: http://localhost:'+wsPort+'/' );
	
};

/** REST web service to GET layout structure: */
webservices.get(
	'/svc/layout/:id', 
	function( req, res ){
		if (  gui.pages[ req.params.id ] ) {
			res.send( JSON.stringify( gui.pages[req.params.id ] ) );
		} else {
		    res.statusCode = 404;
		    return res.send('Error 404: No quote found');
		}  
	}
);

/** Set defaults for all required configurations */
gui.setDefaults = function setDefaults() {
	console.log("Processing Action.");
	
	this.pages['main'] = {
			'header':{
				'title':'Test', 'logoText':'Test'
			},
			'rows':[],
			'footer':{
				'copyrightText':'powered by <a href="https://github.com/ma-ha/rest-web-ui">ReST-Web-GUI</a>' 
			}
	};


};