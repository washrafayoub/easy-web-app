/*!
 * easy-web-gui
 * Copyright(c) 2016 ma-ha
 * MIT Licensed
 */

var gui = exports = module.exports = { pages:{} }; 

// use express for REST services
var express     = require('express');
var bodyParser  = require('body-parser');
var webservices = express();
var jsonParser  = bodyParser.json();


/** Initialize the Web GUI*/
gui.init = function init( port ) {
	this.setDefaults();

	var wsPort = port || 8888;
	webservices.listen( wsPort );
	
	console.log( 'Web GUI: http://localhost:'+wsPort+'/' );
};


/** Set defaults for all required configurations */
gui.setDefaults = function setDefaults() {
	// create a default "main" page minimum config
	this.pages['main'] = {
		'title':'Test', 
		'header':{
			'logoText':'Test',
			"modules" : [ 
	             { "id": "MainNav", "type": "pong-navbar", "param": { "confURL":"/svc/nav" } },
			]
		},
		'rows':[],
		'footer':{
			'copyrightText':'powered by <a href="https://github.com/ma-ha/rest-web-ui">ReST-Web-GUI</a>' 
		}
	};
};


gui.addPage = function addPage( page ) {
	if ( this.pages[ encodeURIComponent( page ) ] ) {
		console.log('gui.addPage: Page "'+pg+'" already exists in GUI.');				
	} else {
		this.pages[ encodeURIComponent( page ) ] = {
				'title':page,
				'includeHeader':'main',
				'rows':[],
				"includeFooter":"main"
			};
	}
};


/** High level API to add a IO view */
gui.addIoView = function addIoView( page) {
	if ( ! this.io ) { 
		this.io = [];
		/** REST web service to GET IO data */
		webservices.get(
				'/svc/io/:ioId', 
				function( req, res ){
					//console.log( 'pinnnng ' + req.params.ioId );
					res.json( gui.io[ req.params.ioId ] );
				}
			);
		webservices.post(
				'/svc/io/:ioId',
				jsonParser,
				function( req, res ){
					console.log( 'pinnnng ' + JSON.stringify( req.body ) );
					// TODO: why is req.body undefined here?
// Dummy code
gui.io[ req.params.ioId ]["myFirstLED"] = { "value":-1 }; 
gui.io[ req.params.ioId ]["mySwitch"] = { "value":"off" }; 
					res.statusCode = 200;
					return res.json( gui.io[ req.params.ioId ] );
				}
			);
	}
	var ioId = this.io.length;
	this.io.push( {} );
	var io = gui.addView( 
			{ 'id':'io'+ioId, 'type':'pong-io' },
			{ "imgURL":"img.png", "dataURL":"svc/io/"+ioId, "poll":"10000", "io":[] },
			page );
	io.ioId = ioId;
	io.setUpdateMilliSec = function( ms ) {
		this.moduleConfig.poll = ms;
	};
	
	io.addLED = function( id, x, y, value ) {
		this.moduleConfig.io.push( { "id":id, "type":"LED", "pos":{ "x":x, "y":y } } );
		gui.io[ this.ioId ][id] = { "value":value }; 
	};
	io.setLED = function( id, value ) {
		gui.io[ this.ioId ][id].value = value;
	};
	
	io.addSwitch = function( id, x, y, values ) {
		if ( values && values.length > 0 ) {
			this.moduleConfig.io.push( { "id":id, "type":"Switch", "pos":{ "x":x, "y":y }, "values":values } );
			gui.io[ this.ioId ][id] = { "value":values[0] }; 			
		} else {
			console.log( "addSwitch: Ignored, values should be an array!" );
		}
	};
	return io;
};	


/** add a view to the page */
gui.addView = function addView( def, config, page ) {
	var pg = page || 'main';
	pg = encodeURIComponent( pg );
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
	//console.log( JSON.stringify( this.pages[ pg ] ) );
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
	'/svc/layout/:id/structure', 
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


/** single page does it all, the layout parameter references the "page". default is the "main" page */
webservices.get( 
		'/', 
		function( req, res ) {
			res.redirect( '/index.html' ); 
		}
	);
webservices.get( 
		'/index.html', 
		function( req, res ) {
			res.sendFile( __dirname + '/index.html' ); 
		}
	);


/** web service for multi page navigation bar */
webservices.get( 
	'/svc/nav', 
	function( req, res ) {
		var navTabs = [];
		//console.log( 'GET /svc/nav '+gui.pages.length );
		for ( var layoutId in gui.pages ) {
			//console.log( '>>'+layoutId );
		    if ( gui.pages.hasOwnProperty( layoutId ) ) {
		    	navTabs.push( { 'layout': layoutId, 'label': gui.pages[ layoutId ].title } );
		    }
		}
		res.json( { 'navigations':navTabs } );
	}
);


