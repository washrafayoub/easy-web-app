/*!
 * easy-web-gui
 * Copyright(c) 2016 ma-ha
 * MIT Licensed
 */

var gui = exports = module.exports = {
  pages : {}
};

// use express for REST services
var express     = require( 'express' );
var webservices = express();
var bodyParser  = require( 'body-parser' );
var jsonParser  = bodyParser.json ();

// logger
var log = require('npmlog');

/** Initialize the Web GUI */
gui.init = function init(port) {
  this.setDefaults();
  var wsPort = port || 8888;
  webservices.listen( wsPort );
  log.info( 'Web GUI', 'http://localhost:' + wsPort + '/' );
};

/** Set defaults for all required configurations */
gui.setDefaults = function setDefaults() {
  // create a default "main" page minimum config
  this.pages[ 'main' ] = {
    'title' : 'Test',
    'header' : {
      'logoText' : 'Test',
      "modules" : [ {
        "id" : "MainNav",
        "type" : "pong-navbar",
        "param" : {
          "confURL" : "/svc/nav"
        }
      } ]
    },
    'rows' : [],
    'footer' : {
      'copyrightText' : 'powered by '+
        '<a href="https://github.com/ma-ha/rest-web-ui">ReST-Web-GUI</a>'
    }
  };
};

gui.addPage = function addPage( page ) {
  if ( this.pages[ encodeURIComponent ( page ) ] ) {
    log.warn( 'gui.addPage', 'Page "' + pg + '" already exists in GUI.' );
  } else {
    this.pages[ encodeURIComponent ( page ) ] = {
      'title' : page,
      'includeHeader' : 'main',
      'rows' : [],
      "includeFooter" : "main"
    };
  }
};

/** High level API to add a IO view */
gui.addIoView = function addIoView( page ) {
  if ( !this.io ) {  // first initialization
    this.io = [];

    /** REST web service to GET IO data */
    webservices.get ( 
        '/svc/io/:ioId', 
        function ( req, res ) {
          // console.log( 'ping: ' + req.params.ioId );
          res.json( gui.io[ req.params.ioId ] );
        } 
    );

    webservices.post( 
      '/svc/io/:ioId', 
      jsonParser, 
      function ( req, res ) {
        // console.log( JSON.stringify( req.body ) );
        if ( req.body && req.body.id && req.body.value && req.params.ioId ) {
          var ioID = req.params.ioId;
          var ctlID = req.body.id;
          if ( gui.io[ ioID ][ ctlID ] ) {
            gui.io[ ioID ][ ctlID ].value = req.body.value;
            if ( gui.io[ ioID ][ ctlID ].callBack ) {
              gui.io[ ioID ][ ctlID ].callBack ( req.body.value );
            } else {
              log.warn( 'POST /svc/io', 
                  'no CallBack for ID "' + ctlIDreq.body.id + '" defined' );
            }
          }
        }
        res.statusCode = 200;
        return res.json( gui.io[ req.params.ioId ] );
      } 
    );
  }
  var ioId = this.io.length;
  this.io.push( {} );
  
  // define IO Object
  var io = gui.addView( {
      'id' : 'io' + ioId,
      'type' : 'pong-io'
    }, 
    {
      'imgURL' : 'img.png',
      'dataURL' : 'svc/io/' + ioId,
      'poll' : '10000',
      'io' : []
    }, 
    page 
  );
  io.ioId = ioId;

  // IO method to define update polling 
  io.setUpdateMilliSec = function (ms ) {
      this.moduleConfig.poll = ms;
  };

  io.addLED = function ( id, x, y, value ) {
    if ( id && (x >= 0) && (y >= 0) ) {
      this.moduleConfig.io.push ( 
        {
          "id" : id,
          "type" : "LED",
          "pos" : { "x" : x, "y" : y }
        } 
      );
      gui.io[ this.ioId ][ id ] = {
        "value" : (value || 0)
      };

    } else {
      log.warn( 'addLED', 'need proper "ID", "x" and "y" values!' );
    }
  };

  io.setLED = function( id, value ) {
    if ( id && gui.io[ this.ioId ][ id ] ) {
      if ( [ -1, 0, 1 ].indexOf ( value ) >= 0 ) {
        gui.io[ this.ioId ][ id ].value = value;
        //console.log( value );
      } else {
        log.warn( 'setLED', 'value "' + value + '" ignored' );
      }
    } else {
      log.warn( 'setLED',':id "' + io + '" unknown' );
    }
  };

  io.addSwitch = function( id, x, y, values, callBack ) {
    if ( values && values.length > 0 ) {
      this.moduleConfig.io.push ( {
        "id" : id,
        "type" : "Switch",
        "pos" : {
          "x" : x,
          "y" : y
        },
        "values" : values
      } );
      gui.io[ this.ioId ][ id ] = {
        "value" : values[ 0 ],
        "callBack" : callBack
      };
    } else {
      log.warn( 'addSwitch: ', 'Ignored, values should be an array!' );
    }
  };
  return io;
};

/** add a view to the page */
gui.addView = function addView( def, config, page ) {
  var pg = page || 'main';
  pg = encodeURIComponent ( pg );
  var view = {};
  if ( !this.pages[ pg ] ) {
    log.warn( 'gui.addView', 'Page "' + pg + '" not found in GUI!' );
    return null;
  }
  if ( !def ) {
    log.warn( 'gui.addView', '"def" is required parameter!' );
    return null;
  }
  if ( !def.id ) {
    log.warn( 'gui.addView','"def.id" is required!' );
    return null;
  } else { // OK, add view
    view[ 'rowId' ]  = def.id;
    view[ 'title' ]  = def.title || def.id || "View:";
    view[ 'decor' ]  = def.decor || 'decor';
    view[ 'height' ] = def.height || '400px';
    view[ 'resourceURL' ] = def.resourceURL || "none";
    if ( def.type ) {
      view[ 'type' ] = def.type;
    }
    if ( config ) {
      view[ 'moduleConfig' ] = config;
    }
    this.pages[ pg ].rows.push ( view );
  }
  // console.log( JSON.stringify( this.pages[ pg ] ) );
  return view;
};


/* define static directories to load the framework into the web page */
var staticDir = __dirname + '/node_modules/rest-web-gui/html';
webservices.use ( '/css', express.static ( staticDir + '/css' ) );
webservices.use ( '/js', express.static ( staticDir + '/js' ) );
webservices.use ( '/img', express.static ( staticDir + '/img' ) );
webservices.use ( '/modules', express.static ( staticDir + '/modules' ) );
webservices.use ( '/i18n', express.static ( staticDir + '/i18n' ) );


/** REST web service to GET layout structure: */
webservices.get( 
  '/svc/layout/:id/structure', 
  function( req, res ) {
    if ( gui.pages[ req.params.id ] ) {
      var layout = {
        'layout' : gui.pages[ req.params.id ]
      };
      res.send ( JSON.stringify ( layout ) );
    } else {
      res.statusCode = 404;
      return res.send( 'Error 404: No quote found' );
    }
  } 
);


/**
 * Single page does it all, the layout parameter references the "page". Default
 * is the "main" page
 */
webservices.get ( 
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
    // console.log( 'GET /svc/nav '+gui.pages.length );
    for ( var layoutId in gui.pages ) {
      // console.log( '>>'+layoutId );
      if ( gui.pages.hasOwnProperty ( layoutId ) ) {
        navTabs.push( {
          'layout' : layoutId,
          'label' : gui.pages[ layoutId ].title
        } );
      }
    }
    res.json( { 'navigations' : navTabs } );
  }
);