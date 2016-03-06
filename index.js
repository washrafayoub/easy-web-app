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

webservices.use( '/css',     express.static( __dirname + '/node_modules/rest-web-gui/css' ) );
webservices.use( '/js',      express.static( __dirname + '/node_modules/rest-web-gui/js'  ) );
webservices.use( '/img',     express.static( __dirname + '/node_modules/rest-web-gui/img'  ) );
webservices.use( '/modules', express.static( __dirname + '/node_modules/rest-web-gui/modules'  ) );


/** REST web service to GET layout structure: */
webservices.get(
	'/svc/layout/:id', 
	function( req, res ){
		if (  gui.pages[ req.params.id ] ) {
			var layout = { 'layout': gui.pages[req.params.id ]  };
			res.send( JSON.stringify( layout) );
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
