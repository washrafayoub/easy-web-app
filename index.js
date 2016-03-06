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
	
	webservices.use( '/css', express.static( gui.staticCSS ) );
	webservices.use( '/js', express.static( gui.staticJS ) );
	webservices.use( '/img', express.static( gui.staticImg ) );
	webservices.use( '/modules', express.static( gui.staticMod ) );

};

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
	
//	this.staticCSS =  __dirname + '/css';
//	this.staticJS  =  __dirname + '/js';
//	this.staticImg =  __dirname + '/img';
//	this.staticMod =  __dirname + '/modules';
	
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

webservices.get( 
	'/', 
	function( req, res ) {
		res.sendFile( __dirname + '/index.html' );
	}
);
