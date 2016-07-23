/*!
 * easy-web-gui
 * Copyright(c) 2016 ma-ha
 * MIT Licensed
 */

var gui = exports = module.exports = {
  pages : {}
  ,userTokens : {}
  ,pullDownMenu : {}
};

//logger
var log = require( 'npmlog' );

// use express for REST services
var express     = require( 'express' );
var webservices = express();

var bodyParser  = require( 'body-parser' );
// body-parser for JSON payload:
var jsonParser  = bodyParser.json();
// body-parser for parsing application/x-www-form-urlencoded:
var formParser  = bodyParser.urlencoded( { extended: true } );

var cookieParser = require( 'cookie-parser' )
webservices.use( cookieParser() )


/** Initialize the Web GUI */
gui.init = function init( logoText, port ) {
  var mainPage = this.setDefaults()
  mainPage.header.logoText = logoText
  var wsPort = port || 8888
  webservices.listen( wsPort )
  log.info( 'Web GUI', 'http://localhost:' + wsPort + '/' )
  return mainPage
}

gui.getExpress = function getExpress() {
  return webservices;
}

/** Set defaults for all required configurations */
gui.setDefaults = function setDefaults() {
  // create a default "main" page minimum config
  this.pages[ 'main' ] = {
      title : 'Test'
    , header : {
          logoText : 'Test'
          ,modules : [ {
            id : 'MainNav'
            , type : 'pong-navbar'
            , param : {
                confURL : '/svc/nav' // please define a web service for that ;-)
            }
          } ]
        }
    , rows : []
    , footer : {
        copyrightText : 'powered by '+
          '<a href="https://github.com/ma-ha/rest-web-ui">ReST-Web-GUI</a>'
      , modules: []
    }
  }
    
  this.pages[ 'main' ].addColumnsRow = 
      function ( id, height ) {
        return gui.addColumnsRow( id, this.rows, height  )
      }
  this.pages[ 'main' ].addView =  
      function ( def, config ) {
        def.rowId = def.rowId || def.id;   
        return gui.addViewIn( def, config, this.rows )          
      }
    
  return this.pages[ 'main' ]
}

/** add new pull down menu */
gui.addPullDownMenu = function addPullDownMenu( menuId, menuLabel ) {
	var newMenu = 
	  { id: menuId, 
		type: 'pong-pulldown', 
	    moduleConfig: {
	      title: menuLabel,
	      menuItems : [ ]   
	    } 
	  }
	this.pullDownMenu[ menuId ] = newMenu
	this.pages[ 'main' ].header.modules.push( newMenu )
}

gui.addPullDownMenuHtmlItem = function addPullDownMenuHtmlItem( menuId, htmlString ) {
	if ( this.pullDownMenu[ menuId ] ) { 
		this.pullDownMenu[ menuId ].moduleConfig.menuItems.push( { html:htmlString } )
	} else {
		log.warn( 'addPullDownMenuHtmlItem: Menu "'+menuId+'" not available!')
	}
}

/** add new page to portal, navigation tabs included */
gui.addPage = function addPage( pageId, title, viewDef, viewConfig  ) {
  if ( ! pageId ) {
    log.warn( 'gui.addPage', 'pageID not defined propperly' );
  } else if ( this.pages[ pageId ] ) {
    log.warn( 'gui.addPage', 'Page "' + pageId + '" already exists in GUI.' );
  } else {
    var pgObj = {
        title : pageId
      , includeHeader : 'main'
      , rows : []
      , includeFooter : 'main'
    }
    if ( title ) 
      pgObj.title = title 
      
    pgObj.addColumnsRow = 
        function ( id, height) {
          //log.info( 'pages[].addColumns', id )
          return gui.addColumnsRow( id, this.rows, height )
        }
    pgObj.addView =  
        function ( def, config ) {
          def.rowId = def.rowId || def.id;   
          return gui.addViewIn( def, config, this.rows )          
        }
    
    if ( viewDef )  
      pgObj.addView( viewDef, viewConfig )
    
    this.pages[ pageId ] = pgObj

    // check if pag is for pull down menu:
    if ( pageId.indexOf( '/' ) != -1 ) {
    	var menuId = pageId.substr( 0 , pageId.indexOf( '/' ) )
    	//log.info( ' ... '+menuId )
    	if ( this.pullDownMenu[ menuId ] ) {
    		//log.info( 'pullDownMenu: '+menuId )
    		this.pullDownMenu[ menuId ].moduleConfig.menuItems.push( { pageLink:pageId, label:title } )
    	} 
    }

    return pgObj
  }
}


/** split the column into a rows, to add views */
gui.addColumnsRow = function addColumnsRow( id, colArr, height ) {
  //log.info( 'addColumns', id )
  var colsObj = {
      rowId : id
    , height: height || "300px"
    , cols : []
  }
  colsObj.addRowsColumn = 
      function ( id, width ) {
        return gui.addRowsColumn( id, this.cols, width )
      }
  colsObj.addView = 
      function ( def, config ) {
        return gui.addViewIn( def, config, this.cols )          
      }
  colArr.push( colsObj )
  //log.info( 'addColumns', 'colsObj='+JSON.stringify( colsObj ) )
  return colsObj
}


/** split the row into a columns, to add views */
gui.addRowsColumn = function addRowsColumn( id, cols, width ) {
  var newCol = {
      columnId: id
    , width: width || "300px"
    , rows : []
  }
  newCol.addRows = 
      function ( height ) {
       return gui.addColumns( this.rows, height )
      }
  newCol.addView =
      function ( def, config ) { 
        return gui.addViewIn( def, config, this.rows )          
      }
  cols.push( newCol )
  return newCol
}

gui.addViewIn = function addViewIn( def, config, arr ) {
  var view = JSON.parse( JSON.stringify( def ) ) // clone it
  view.title = def.title || def.id || "View:"
  view.decor = def.decor || 'decor'
  view.resourceURL = def.resourceURL || "none"
  view.height = def.height || '400px'
  if ( config ) {
    def.moduleCOnfig = config
  }
  arr.push( view )
  return view
}

/** add a view (new row) to the page */
gui.addView = function addView( def, config, page ) {
  var pg = page || 'main';
  //pg = encodeURIComponent ( pg );
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
    if (def. actions ) {
      view[ 'actions' ] = def.actions;
    }
    this.pages[ pg ].rows.push ( view );
  }
  // console.log( JSON.stringify( this.pages[ pg ] ) );
  return view;
};


/* define static directories to load the framework into the web page */
var staticDir = __dirname + '/node_modules/rest-web-gui/html';
webservices.use ( '/css',     express.static( staticDir + '/css' ) );
webservices.use ( '/js',      express.static( staticDir + '/js' ) );
webservices.use ( '/img',     express.static( staticDir + '/img' ) );
webservices.use ( '/modules', express.static( staticDir + '/modules' ) );
//webservices.use ( '/i18n',    express.static( staticDir + '/i18n' ) );


/** REST web service to GET layout structure: */
webservices.get( 
  '/svc/layout/:id/structure', 
  function( req, res ) {
    
    if ( gui.authorize && ! gui.authorize( gui.getUserId(req), req.params.id ) ) {
      res.statusCode = 401;
      return res.send( 'Not authorized' );      
    }

    //console.log( '>>'+req.params.id );
    if ( gui.pages[ req.params.id ] ) {
      var layout = {
        'layout' : gui.pages[ req.params.id ]
      };
      res.json( layout );
    } else {
      res.statusCode = 404;
      return res.send( 'Error 404: No quote found' );
    }
  } 
);

/** REST web service to GET layout structure for sub menu pages: */
webservices.get( 
  '/svc/layout/:id/:subid/structure', 
  function( req, res ) {
    var page = req.params.id +'/'+ req.params.subid
    //console.log( '>>'+req.params.subid );
    if ( gui.authorize && ! gui.authorize( gui.getUserId(req), page ) ) {
      res.statusCode = 401;
      return res.send( 'Not authorized' );      
    }
    if ( gui.pages[ page ] ) {
      var layout = {
        'layout' : gui.pages[ page ]
      };
      res.json( layout );
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
    var navTabs = []
    var subMenus = {}
    var userId = gui.getUserId( req )
    // console.log( 'GET /svc/nav '+gui.pages.length );
    for ( var layoutId in gui.pages ) {
      //console.log( '>>'+layoutId );
      if ( gui.pages.hasOwnProperty ( layoutId ) ) {
        if ( layoutId.indexOf( '/' ) == -1 ) {
          if ( layoutId.indexOf( '-m' ) != layoutId.length -2 && // ignore alternate mobile layouts  
               layoutId.indexOf( '-t' ) != layoutId.length -2 ) {  // ignore alternate tablet layouts
            // check authorization for page
            if ( gui.authorize && ! gui.authorize(userId,layoutId) ) {
              // not visible for this user
            } else {
              navTabs.push( {
                'layout' : layoutId,
                'label' : gui.pages[ layoutId ].title
              } )              
            }
          }
        } else { // sub-menu
          var subMenu = layoutId.substr( 0 , layoutId.indexOf( '/' ) )
          if ( ! gui.pullDownMenu[ subMenu ] ) { // if this is not a pull down
	          if ( ! subMenus[ subMenu ] ) { // first sub menu item creates menu
	            if ( layoutId.indexOf( '-m' ) != layoutId.length -2 && // ignore alternate mobile layouts  
	                layoutId.indexOf( '-t' ) != layoutId.length -2 ) {  // ignore alternate tablet layouts
	  
	              if ( gui.authorize && ! gui.authorize(userId,layoutId) ) {
	                // not visible for this user
	              } else {
	                subMenus[ subMenu ] = navTabs.length
	                navTabs.push( {
	                  label : subMenu,
	                  menuItems: []
	                } )
	              }
	            }
	          }
	          if ( gui.authorize && ! gui.authorize(userId,layoutId) ) {
	            // not visible for this user
	          } else {
	            navTabs[ subMenus[ subMenu ] ].menuItems.push({
	              'layout' : layoutId,
	              'label' : gui.pages[ layoutId ].title
	            } )
	          }
	        }
        }
      }
    }
    // show only menu, if it's  more than one page
    if ( navTabs.length == 1 && ! Object.keys( gui.pullDownMenu ).length > 0 )  navTabs = [] 
    res.json( { 'navigations' : navTabs } )
  }
);

//----------------------------------------------------------------------------
// i18n:


/** first call switches on i18n, further calls add supported languages */
gui.addLang = function addLang( langCode, translations ) {
  var trnsl = {}
  if ( translations ) { trnsl = translations } 
  if ( ! this.lang ) {
    this.lang = { }
    this.lang[ langCode ] = trnsl
    this.pages[ 'main' ].header.modules.push( 
        { 
          'id': 'LangSel', 'type': 'i18n'
          ,'param': { 'langList': [ langCode ] } 
        }
      ) 
  } else {
    this.lang[ langCode ] = trnsl
    for (var i = 0; i < this.pages[ 'main' ].header.modules.length; i++) {
      var mod = this.pages[ 'main' ].header.modules[i]
      if ( mod.id == 'LangSel' ) {     
        mod.param.langList.push( langCode )
      }
    }
  }
}

gui.addTranslation = function addTranslation( langCode, label, translation ) {
  if ( gui.lang && gui.lang[ langCode ] ) {
    gui.lang[ langCode ][label] = translation
  }
}

webservices.get(
    '/i18n/:lang',
    function( req, res ) {
      if ( req.params.lang  ) {
        var langCode = req.params.lang.substring( 0, 2 )
        if ( gui.lang && gui.lang[ langCode ] ) {
          res.json( gui.lang[ langCode ] )
        } else {
          res.json( {} ) // don't offer any translations
        }
      } else {
        res.json( {} ) // don't offer any translations
      }
    }
  )


// ----------------------------------------------------------------------------

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
  // IO method to define update polling 
  io.setBackgroundImage = function ( imgFullPath ) {
    
      var bgImgName = '/local'+imgFullPath.substring( imgFullPath.lastIndexOf( '/' ) );
      var bgImgPath = imgFullPath.substring( 0, imgFullPath.lastIndexOf( '/' ) );
//      log.info( 'static /local', bgImgPath +' '+ bgImgName);
      this.moduleConfig.imgURL = bgImgName;
      webservices.use ( '/local', express.static( bgImgPath ) );

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

//----------------------------------------------------------------------------
// security

/** add pong-security plug in to header */
gui.enableSecurity = 
  function enableBasicAuth( paramObj ) {
    var secParams = {}
    if ( ! paramObj ) {paramObj = {} }
    secParams.loginURL = ( paramObj.loginURL ? paramObj.loginURL : '/login' )
    secParams.loginPage = ( paramObj.loginPage ? paramObj.loginPage : 'main' )
    secParams.registgerURL = ( paramObj.registgerURL ? paramObj.registgerURL : null )
    secParams.logoutPage = ( paramObj.logoutPage ? paramObj.logoutPage : 'main' )
    secParams.logoutURL = ( paramObj.logoutURL ? paramObj.logoutURL : '/logout' )
    this.pages[ 'main' ].header.modules.push(
      { 'id': 'Sec', 'type': 'pong-security', 'param': secParams }
    ) 
    log.info( "Security is enabled!" )
  }


webservices.post(
    '/login', 
    formParser, 
    function(req, res) {
      //log.info( "POST Login ..." )
      if ( gui.authenticate != null ) {
        if ( req.body && req.body.userid ) {
          //log.info( "calling authenticate ..." )
          if ( gui.authenticate( req.body.userid, req.body.password ) ) {
            //log.info( "Login OK" )
            res.statusCode = 200
            // todo set up "session" for user via hook
            var token = ''
            if ( gui.createToken ) { 
              token = gui.createToken( req.body.userid ) 
            } else {
              var chrs = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
              for ( var i = 0; i < 32; i++ ) {
                var iRnd = Math.floor( Math.random() * chrs.length )
                token += chrs.substring( iRnd, iRnd+1 )
              }
            }
            //log.info( "Token: "+token )
            gui.userTokens[ token ] = req.body.userid 
            res.cookie( 'pong-security', 
                token, 
                { expires: new Date(Date.now() + 6400000), httpOnly: true }
            );
            res.send(  "Login OK" )
          } else {
            //log.info( "Login failed!" )            
            res.statusCode = 401
            res.send(  "Login failed" )
          }
        } else if ( gui.getUserId( req ) ) {
          res.statusCode = 200
          res.send( gui.getUserId( req ) )
          return
        } else {
          //log.info( "user/password or cookie required" )            
          res.statusCode = 401
          res.send( "Login failed" )          
        }
      } else {
        //log.info( "Please implement authenticate function:" )
        //log.info( " gui.authenticate = function authenticate(user, password)"+
        //    " { ... return true/false }")
        res.statusCode = 401
        res.send( "Login failed" )                  
      }
    }
  )

gui.getUserId = function getUserId( req ) {
  var userId = null
  if ( req.cookies && req.cookies[ 'pong-security' ] ) {
    //log.info( "getUserId: pong-security cookie ..." )

    var token = req.cookies[ 'pong-security' ]
    //log.info( "getUserId: token = "+token )
    if ( token ) {
      if ( gui.getUserIdForToken ) {
        //log.info( "gui.getUserIdForToken..." )
        userId = gui.getUserIdForToken( token )      
      } else if ( gui.userTokens[ token ] ) {
        //log.info( "getUserId: userId = "+gui.userTokens[ token ] )
        userId = gui.userTokens[ token ]
      }
    }
  }
  return userId
}

webservices.post(
    '/logout', 
    formParser, 
    function(req, res) {
      //log.info( "POST Logout ..." )
      //log.info( 'Cookies: ', req.cookies )
      if ( req.cookies && req.cookies[ 'pong-security' ] ) {
        //log.info( "pong-security cookie ..." )

        var token = req.cookies[ 'pong-security' ]
        //log.info( "token = "+token )
        //log.info( "user = " + gui.userTokens[ token ]  )
        if ( gui.deleteUserIdForToken ) {
          gui.deleteUserIdForToken( token )
        } else if ( gui.userTokens[ token ] ) {
          delete gui.userTokens[ token ]
        }
        res.statusCode = 200
        res.send( "" )
      }
    }
  )
  
