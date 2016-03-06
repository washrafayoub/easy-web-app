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

gui.addPage = function addPage( page ) {
	if ( this.pages[ pg ] ) {
		console.log('gui.addPage: Page "'+pg+'" already exists in GUI.');				
	} else {
		// TODO implement addPage		
	}
};

	
gui.addView = function addView( def, config, page ) {
	var pg = page || 'main';
	var view = {};
	if ( ! this.pages[ pg ] ) {
		console.log('gui.addView: Page "'+pg+'" not found in GUI!');
		return null;
	} if ( ! def ) {
		console.log('gui.addView: "def" is required parameter!');
		return null;		
	} if ( ! def.id ) {
		console.log('gui.addView: "def.id" is required!');
		return null;		
	} else { // OK, add view
		view['rowId']  = def.id;
		view['title']  = def.title || def.id || "View:";
		view['decor']  = def.decor || 'decor';
		view['height'] = def.height || '400px';
		view['resourceURL'] = def.resourceURL || "none";
		if ( def.type ) { 
			view['type']   = def.type; 
		}
		if ( config ) {
			view['moduleConfig'] = config; 
		}
		this.pages[ pg ].rows.push( view );
	}
	console.log( JSON.stringify( this.pages[ pg ] ) );
	return view;
};


/* define static directories to load the framework into the web page */
webservices.use( '/css',     express.static( __dirname + '/node_modules/rest-web-gui/css' ) );
webservices.use( '/js',      express.static( __dirname + '/node_modules/rest-web-gui/js'  ) );
webservices.use( '/img',     express.static( __dirname + '/node_modules/rest-web-gui/img'  ) );
webservices.use( '/modules', express.static( __dirname + '/node_modules/rest-web-gui/modules'  ) );
webservices.use( '/i18n',    express.static( __dirname + '/node_modules/rest-web-gui/i18n'  ) );


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

/** sinlge page does it all, the layout parameter references the "page". default is the "main" page */
webservices.get( 
	'/', 
	function( req, res ) {
		res.sendFile( __dirname + '/index.html' ); // TODO: pass URL-parameters
	}
);
