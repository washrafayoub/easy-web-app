/*!
 * easy-web-gui
 * Copyright(c) 2018 ma-ha
 * MIT Licensed
 */

var gui = exports = module.exports = {
  pages : {}
  ,userTokens : {}
  ,pullDownMenu : {}
  ,appRoot: '/'
  ,decor: 'decor'
};

// logger
var log = require( 'npmlog' );

// use express for REST services
var express     = require( 'express' );
var webservices = express();
var router = express.Router();

var bodyParser  = require( 'body-parser' );
// body-parser for JSON payload:
var jsonParser  = bodyParser.json();
// body-parser for parsing application/x-www-form-urlencoded:
var formParser  = bodyParser.urlencoded( { extended: true } );

var cookieParser = require( 'cookie-parser' )
webservices.use( cookieParser() )

// support external confugation
var config = require( 'config' )
if ( config.staging ) { log.info( 'Web GUI', 'config stage: '+config.staging ) }
var cfg = {}
if ( config.has('easy-web-app') ) { 
  cfg = config.get( 'easy-web-app' ) 
  if ( cfg.enableCustomCSS ) {
    router.use( '/css-custom', express.static( process.cwd()+'/css' ) )
    log.info( 'Web GUI', 'use '+process.cwd() +'/custom.css' )
  }
  if ( cfg['img-cust'] ) {
    router.use( '/img-cust', express.static( process.cwd() +'/'+ cfg['img-cust'] ) )
    log.info( 'Web GUI', 'get "/img-cust" from folder '+process.cwd() +'/'+ cfg['img-cust']   )
  }
}
log.info( 'Web GUI', 'config port: '+cfg.port )

if ( config.loglevel ) { 
  log.info( 'Web GUI', 'switch to log level: '+config.loglevel )
  log.level = config.loglevel 
}

/** Initialize the Web GUI */
gui.init = function init( logoText, port, rootPath, options ) {
  this.appRoot = rootPath || cfg.rootPath || '/'
  if ( this.appRoot.indexOf('/') != 0 ) { this.appRoot = '/'+this.appRoot }
  var mainPage = this.setDefaults( options )
  mainPage.header.logoText = cfg.logoText || logoText
  mainPage.title           = cfg.title || mainPage.title
  mainPage.footer.copyrightText = cfg.copyrightText || mainPage.footer.copyrightText
  if ( cfg.logoURL ) { mainPage.setLogoURL( cfg.logoURL ) }

  var wsPort = port || cfg.port || 8888
  if ( typeof WEB_SERVER_PORT !== 'undefined' ) { 
    wsPort = WEB_SERVER_PORT  //  global setting override
  }
  webservices.use( this.appRoot, router )
  webservices.listen( wsPort )
  log.info( 'Web GUI', 'http://localhost:' + wsPort + this.appRoot )
  if ( cfg.enableSecurity === true ) {
    gui.enableSecurity()
    if ( cfg.loginTimeout ) {
      gui.loginTimeout = cfg.loginTimeout 
    }
  }
  return mainPage
}

gui.getExpress = function getExpress() {
  return router;
}

/** Set defaults for all required configurations */
gui.setDefaults = function setDefaults( options ) {
  // create a default "main" page minimum config
  var  navUrl = ( this.appRoot=='/' ? '/svc/nav' : this.appRoot+'/svc/nav' ) 
  this.pages[ 'main' ] = {
      title : 'Main Page'
    , header : {
          logoText : 'Test'
          ,frameWarning: "true"
          ,modules : [ ]
        }
    , rows : []
    , footer : {
        copyrightText : 'powered by '+
          '<a href="https://github.com/ma-ha/rest-web-ui">ReST-Web-GUI</a>'
      , modules: []
    }
  }

  this.pages[ 'main' ].setLogoText =
    function( text ) {
      this.header['logoText'] = text
    }

  this.pages[ 'main' ].setLogoURL =
    function( url ) {
      this.header['logoURL'] = url
    }

  this.pages[ 'main' ].setTitle =
    function( text ) {
      this.title = text
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

  /** set page width attribute and override CSS */
  this.pages[ 'main' ].setPageWidth = 
    function setPageWidth( width  ) {
      this[ 'page_width' ] = width
    }
  
  this.pages[ 'main' ].setCopyright =
    function( text ) {
      this.footer['copyrightText'] = text
    }

  this.pages[ 'main' ].addFooterLink =
    function( linkText, linkURL, linkTarget ) {
    if ( ! this.footer['linkList'] ) {  this.footer['linkList'] = [] }
    if ( linkTarget ) {
      this.footer['linkList'].push( { text:linkText, url:linkURL, target:linkTarget } )
    } else {
      this.footer['linkList'].push( { text:linkText, url:linkURL } )
    }
  }

  this.pages[ 'main' ].addInfo =
    function( text ) {
      this.info = text
    }

  this.pages[ 'main' ].delInfo =
    function( ) {
      this.info = null
    }

  if ( options && options.nav == 'embedded' ) {
    var navView = {
      id : 'Nav', title:'',
      type:'pong-nav-embed',
      resourceURL:'/svc/nav-embed', 
      height:'XX', decor:"none"
    }
    this.pages[ 'main' ].addView ( navView )
    options.decor = 'none'
    this.pages[ 'main' ].header.embedNav = true
  } else {
    var navbar = { 
        id : 'MainNav' , type : 'pong-navbar'
        , param : {
            confURL : navUrl
        }
      } 
    this.pages[ 'main' ].header.modules.push( navbar )
  }
  if ( options && options.decor != 'none' ) {
    this.pages[ 'main' ].decor = gui.decor
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

/** add a new pull down menu header module */
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
          // log.info( 'pages[].addColumns', id )
          return gui.addColumnsRow( id, this.rows, height )
        }
    pgObj.addView =  
        function ( def, config ) {
          def.rowId = def.rowId || def.id;   
          return gui.addViewIn( def, config, this.rows )          
        }
    /** set page width attribute and override CSS */
    pgObj.setPageWidth = 
      function setPageWidth( width  ) {
        this[ 'page_width' ] = width
      }
    
    pgObj.addInfo =
      function( text ) {
        this.info = text
      }

    pgObj.delInfo =
      function(  ) {
        this.info = null
      }

    if ( this.pages[ 'main' ].header.embedNav ) {
      var navView = {
        id : 'Nav', title:'',
        type:'pong-nav-embed',
        resourceURL:'/svc/nav-embed', 
        height:'XX', decor:"none"
      }
      pgObj.addView ( navView )
    }

    pgObj.addSubNav =
      function(  ) {
          var navView = {
            id : 'SubNav', title:'',
            type:'pong-nav-embed',
            resourceURL:'/svc/nav-embed-sub', 
            height:'XX', decor:"none"
          }
          pgObj.addView ( navView )
      }

      if ( viewDef )  
      pgObj.addView( viewDef, viewConfig )
    
    this.pages[ pageId ] = pgObj

    // check if pag is for pull down menu:
    if ( pageId.indexOf( '/' ) != -1 ) {
    	var menuId = pageId.substr( 0 , pageId.indexOf( '/' ) )
    	// log.info( ' ... '+menuId )
    	if ( menuId == 'user') {
    		//log.info( 'menu "'+menuId +'": '+pageId)
    		if ( ! gui.secParams.userPages ) { gui.secParams.userPages = {} }
    		gui.secParams.userPages[ title ] = pageId
    	} else if ( this.pullDownMenu[ menuId ] ) {
    		// log.info( 'pullDownMenu: '+menuId )
    		this.pullDownMenu[ menuId ].moduleConfig.menuItems.push( 
    		    { pageLink:pageId, label:title } 
    		)
    	} 
    }

    return pgObj
  }
}


/** split the column into a rows, to add views */
gui.addColumnsRow = function addColumnsRow( id, colArr, height ) {
  // log.info( 'addColumns', id )
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
        if ( def.id && ! def.columnId ) {
          def.columnId = def.id
        }
        return gui.addViewIn( def, config, this.cols )          
      }
  colArr.push( colsObj )
  // log.info( 'addColumns', 'colsObj='+JSON.stringify( colsObj ) )
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
        if ( def.id && ! def.rowId ) {
          def.rowId = def.id
        }
        return gui.addViewIn( def, config, this.rows )          
      }
  cols.push( newCol )
  return newCol
}

gui.addViewIn = function addViewIn( def, config, arr ) {
  var view = JSON.parse( JSON.stringify( def ) ) // clone it
  if ( def.title == '' ) { view.title = null } 
    else { view.title = def.title || def.id || "View:" }
  view.decor = def.decor || this.decor
  view.resourceURL = def.resourceURL || "none"
  view.height = def.height || '400px'
  if ( config ) {
    view.moduleConfig = config
  }
  arr.push( view )
  return view
}

/** add a view (new row) to the page */
gui.addView = function addView( def, config, page ) {
  var pg = page || 'main';
  // pg = encodeURIComponent ( pg );
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
    view[ 'decor' ]  = def.decor || this.decor;
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
var fs = require('fs')
var staticDir = __dirname + '/rest-web-gui/html'
if ( fs.existsSync( staticDir ) ) {
    log.info(' Init', 'Using static in '+staticDir )
} else {
  var path =require('path')
  staticDir = path.resolve( __dirname, '../rest-web-gui/html' )
  if ( fs.existsSync( staticDir ) ) {
    log.info(' Init', 'Using static in '+staticDir )
  } else {
    staticDir = __dirname + '/node_modules/rest-web-gui/html'
    if ( fs.existsSync( staticDir ) ) {
      log.info(' Init', 'Using static in '+staticDir )
    } else {
      log.error(' Init', 'No path to "rest-web-gui" found! ' )
      log.error(' Init', 'Tried: '+__dirname + '/rest-web-gui/html' )
      log.error(' Init', 'Tried: '+path.resolve( __dirname, '../rest-web-gui/html' ) )
      log.error(' Init', 'Tried: '+staticDir )
      process.exit(1)
    }
  }
}
router.use ( '/css',     express.static( staticDir + '/css' ) );
router.use ( '/js',      express.static( staticDir + '/js' ) );
router.use ( '/img',     express.static( staticDir + '/img' ) );
router.use ( '/modules', express.static( staticDir + '/modules' ) );
// router.use ( '/i18n', express.static( staticDir + '/i18n' ) );

function getBasePageName( page ) {
  var len2 = page.length -2
  if ( page.indexOf( '-m' ) == len2  ||  page.indexOf( '-t' ) == len2 ) {
    return page.substring( 0, len2 )
  } else { 
    return page
  }
}

/** REST web service to GET layout structure: */
router.get( 
  '/svc/layout/:id/structure', 
  function( req, res ) {
    var pgId = getBasePageName( req.params.id )
    if ( gui.authorize && ! gui.authorize( gui.getUserId(req), pgId ) ) {
      // not authorized for this page
      var redirectPage = ( gui.secParams.needLoginPage ? gui.secParams.needLoginPage : 'main' )
      var pg = JSON.parse( JSON.stringify( gui.pages[ redirectPage ] ) ) // cloned
      if ( gui.authorize && pg.header ) { // check authorization for header modules
        var user = gui.getUserId( req )
        for ( var i = pg.header.modules.length-1; i >= 0; i-- ) {
          //log.info( '>>>>', pg.header.modules[i].type)
          if ( pg.header.modules[i].type != 'pong-security' &&  pg.header.modules[i].type != 'pong-navbar' ) { 
            // all others should be checked for authorization
            if (  pg.header.modules[i].id  && ! gui.authorize( user, pg.header.modules[i].id ) ) {
              delete pg.header.modules[i] // not a
            }
          }
        }
      }
      var layout = {
          'layout' : pg
        };
      return res.json( layout );
    } else  
    if ( gui.pages[ pgId ] ) {
      var pg = JSON.parse( JSON.stringify( gui.pages[ pgId ] ) ) // cloned
      if ( gui.authorize && pg.header ) { // check authorization for header modules
        var user = gui.getUserId( req )
        for ( var i = pg.header.modules.length-1; i >= 0; i-- ) {
          if ( pg.header.modules[i].type != 'pong-security' &&  pg.header.modules[i].type != 'pong-navbar' ) { 
            // all others should be checked for authorization
            if (  pg.header.modules[i].id  && ! gui.authorize( user, pg.header.modules[i].id ) ) {
              delete pg.header.modules[i] // not a
            }
          }
        }
      }
      //log.info( "structure", req.params.id  )
      var layout = {
        'layout' : pg 
      }
      return res.json( layout )
    } else {
      res.statusCode = 404
      return res.send( 'Error 404: No quote found' )
    }
  } 
);

/** REST web service to GET layout structure for sub menu pages: */
router.get( 
  '/svc/layout/:id/:subid/structure', 
  function( req, res ) {
    var page = req.params.id +'/'+ req.params.subid
    // console.log( '>>'+req.params.subid );
    if ( gui.authorize && ! gui.authorize( gui.getUserId(req), page ) ) {
      // not authorized for this page
      var redirectPage = ( gui.secParams.needLoginPage ? gui.secParams.needLoginPage : 'main' )
      var pg = JSON.parse( JSON.stringify( gui.pages[ redirectPage ] ) ) // cloned
      if ( gui.authorize && pg.header ) { // check authorization for header modules
        var user = gui.getUserId( req )
        for ( var i = pg.header.modules.length-1; i >= 0; i-- ) {
          //log.info( '>>>>', pg.header.modules[i].type)
          if ( pg.header.modules[i].type != 'pong-security' &&  pg.header.modules[i].type != 'pong-navbar' ) { 
            // all others should be checked for authorization
            if (  pg.header.modules[i].id  && ! gui.authorize( user, pg.header.modules[i].id ) ) {
              delete pg.header.modules[i] // not a
            }
          }
        }
      }
      var layout = {
          'layout' : pg
        };
      return res.json( layout );
    } else 
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
router.get ( 
  '/', 
  function( req, res ) {
    if ( gui.appRoot == '/' ) {
      res.redirect( '/index.html' );      
    } else {
      res.redirect( gui.appRoot+'/index.html' );      
    }
  }
);


router.get( 
  '/index.html', 
  function( req, res ) {
    res.sendFile( __dirname + '/index.html' );
  }
);


/** web service to assemble top level menu items for embedded navigation bar */
router.get( 
  '/svc/nav-embed', 
  function( req, res ) {
    var navTabs = []
    var layout =  req.query.page
    //  main menu
    for ( var layoutId in gui.pages ) {
      if ( gui.pages.hasOwnProperty ( layoutId ) ) {
        if (( layoutId.indexOf( '-nonav' ) == -1 ||
              layoutId.indexOf( '-nonav' ) != layoutId.length -6  ) && 
            ( layoutId.indexOf( '-m' ) == -1 ||
              layoutId.indexOf( '-m' ) != layoutId.length -2 ) && 
            ( layoutId.indexOf( '-t' ) == -1 ||
              layoutId.indexOf( '-t' ) != layoutId.length -2 ) ) {  
            // check authorization for page
          if ( gui.authorize && ! gui.authorize( userId, layoutId ) ) {
            // not visible for this user
          } else {
            var nav = {
                'layout' : layoutId,
                'label' : gui.pages[ layoutId ].title
              }
            if ( gui.pages[ layoutId ].info ) { nav.info =  gui.pages[ layoutId ].info } 
            navTabs.push( nav )              
          }
        }
      }
    }
    res.json( { 'navigations' : navTabs } )
  }
)

/** web service to assemble sub level menu items for embedded navigation bar */
router.get( 
  '/svc/nav-embed-sub', 
  function( req, res ) {
    var navTabs = []
    var layout =  req.query.page
    var masterPage = layout + '/'
    if ( layout && layout.indexOf( '/' ) > 0 ){
      masterPage = layout.substr( 0, ( layout.indexOf( '/' )+1) )
    } 
    //log.info( 'nav-embed-sub', masterPage )
    for ( var layoutId in gui.pages ) {
        //log.info( 'nav-embed-sub', layoutId +' -> '+layoutId.indexOf( masterPage ) )
        if ( layoutId.indexOf( masterPage ) == 0 ) {
          if ( ( layoutId.indexOf( '-nonav' ) == -1 ||
                 layoutId.indexOf( '-nonav' ) != layoutId.length -6  ) && 
               ( layoutId.indexOf( '-m' ) == -1 ||
                 layoutId.indexOf( '-m' ) != layoutId.length -2 ) && 
               ( layoutId.indexOf( '-t' ) == -1 ||
                 layoutId.indexOf( '-t' ) != layoutId.length -2 ) ) {            // check authorization for page
          if ( gui.authorize && ! gui.authorize( userId, layoutId ) ) {
            // not visible for this user
          } else {
            var nav = {
                'layout' : layoutId,
                'label' : gui.pages[ layoutId ].title
              }
            if ( gui.pages[ layoutId ].info ) { nav.info =  gui.pages[ layoutId ].info } 
            navTabs.push( nav )              
          }
        }
      }
    }
  
    res.json( { 'navigations' : navTabs } )
  }
)

/** web service for multi page navigation bar */
router.get( 
  '/svc/nav', 
  function( req, res ) {
    var navTabs = []
    var subMenus = {}
    var userId = gui.getUserId( req )
    // console.log( 'GET /svc/nav '+gui.pages.length );
    for ( var layoutId in gui.pages ) {
      // console.log( '>>'+layoutId );
      if ( gui.pages.hasOwnProperty ( layoutId ) ) {
        if ( layoutId.indexOf( '/' ) == -1 ) {
          // ignore alternate mobile and tablet layouts
          if ( ( layoutId.indexOf( '-nonav' ) == -1 ||
                 layoutId.indexOf( '-nonav' ) != layoutId.length -6  ) && 
               ( layoutId.indexOf( '-m' ) == -1 ||
                 layoutId.indexOf( '-m' ) != layoutId.length -2 ) && 
               ( layoutId.indexOf( '-t' ) == -1 ||
                 layoutId.indexOf( '-t' ) != layoutId.length -2 ) ) {  
            // check authorization for page
            if ( gui.authorize && ! gui.authorize(userId,layoutId) ) {
              // not visible for this user
            } else {
              var nav = {
                  'layout' : layoutId,
                  'label' : gui.pages[ layoutId ].title
                }
              if ( gui.pages[ layoutId ].info ) { nav.info =  gui.pages[ layoutId ].info } 
              navTabs.push( nav )              
            }
          }
        } else { // sub-menu
          var subMenu = layoutId.substr( 0 , layoutId.indexOf( '/' ) )
          if ( ! gui.pullDownMenu[ subMenu ] ) { // if this is not a pull down
            if ( ! subMenus[ subMenu ] ) { // first sub menu item creates menu
              // ignore alternate mobile and tablet layouts
	            if ( layoutId.indexOf( '-m' ) != layoutId.length -2 && 
	                layoutId.indexOf( '-t' ) != layoutId.length -2 ) {  	  
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
	            var nav = {
	                'layout' : layoutId,
	                'label' : gui.pages[ layoutId ].title
	              }
              if ( gui.pages[ layoutId ].info ) { 
                nav.info =  gui.pages[ layoutId ].info
                navTabs[ subMenus[ subMenu ] ].info = '!'
                //log.info('nav', navTabs )
              } 
	            navTabs[ subMenus[ subMenu ] ].menuItems.push( nav )
	          }
	        }
        }
      }
    }
    // show only menu, if it's more than one page
    if ( navTabs.length == 1 && ! Object.keys( gui.pullDownMenu ).length > 0 )  navTabs = [] 
    res.json( { 'navigations' : navTabs } )
  }
);

// ----------------------------------------------------------------------------
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

router.get(
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
    router.get ( 
        '/svc/io/:ioId', 
        function ( req, res ) {
          // console.log( 'ping: ' + req.params.ioId );
          res.json( gui.io[ req.params.ioId ] );
        } 
    );

    router.post( 
      '/svc/io/:ioId', 
      jsonParser, 
      function ( req, res ) {
        // console.log( JSON.stringify( req.body ) );
        if ( req.body && req.body.id && req.params.ioId ) {
          var ioID = req.params.ioId;
          var ctlID = req.body.id;
          if ( gui.io[ ioID ][ ctlID ] ) {
            if ( req.body.value ) {
              gui.io[ ioID ][ ctlID ].value = req.body.value;
            }
            if ( gui.io[ ioID ][ ctlID ].callBack ) {
              gui.io[ ioID ][ ctlID ].callBack ( req.body.value , ctlID )
            } else {
              log.warn( 'POST /svc/io', 'CallBack undefined: "' + ctlID + '"' )
            }
          } else {
            log.warn( 'POST /svc/io', 'Not defined: gui.io[ '+ioID+' ][ '+ctlID+' ]' ) 
          } 
        } else {
          log.warn( 'POST /svc/io', 'Not valid: req.body && req.body.id && req.params.ioId' )
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
      'dataURL' : ( gui.appRoot=='/' ? '' : gui.appRoot ) + '/svc/io/' + ioId,
      'poll' : '10000',
      'io' : []
    }, 
    page 
  )
  io.ioId = ioId;

  // IO method to define update polling
  io.setUpdateMilliSec = function (ms ) {
      this.moduleConfig.poll = ms;
  }

  // IO method to define update polling
  io.setBackgroundImage = function ( imgFullPath ) {
      if ( imgFullPath ) {
        var bgImgName = ( gui.appRoot=='/' ? '' : gui.appRoot ) + '/local' 
          + imgFullPath.substring( imgFullPath.lastIndexOf( '/' ) );
        var bgImgPath = imgFullPath.substring( 0, imgFullPath.lastIndexOf( '/' ) );
        // log.info( 'static /local', bgImgPath +' '+ bgImgName);
        this.moduleConfig.imgURL = bgImgName;
        router.use ( '/local', express.static( bgImgPath ) );
      } else {
        this.moduleConfig.imgURL = null
      }
  }

  io.addLED = function ( id, x, y, value ) {
    if ( id && (x >= 0) && (y >= 0) ) {
      this.moduleConfig.io.push ( 
        {
          id : id,
          type : "LED",
          pos : { "x" : x, "y" : y }
        } 
      )
      gui.io[ this.ioId ][ id ] = {
        value : (value || 0)
      }

    } else {
      log.warn( 'addLED', 'need proper "ID", "x" and "y" values!' );
    }
  }

  io.setLED = function( id, value ) {
    if ( id && gui.io[ this.ioId ][ id ] ) {
      if ( [ -1, 0, 1 ].indexOf ( value ) >= 0 ) {
        gui.io[ this.ioId ][ id ].value = value;
        // console.log( value );
      } else {
        log.warn( 'setLED', 'value "' + value + '" ignored' );
      }
    } else {
      log.warn( 'setLED',':id "' + io + '" unknown' );
    }
  }

  io.addSwitch = function( id, x, y, values, callBack ) {
    if ( values && values.length > 0 ) {
      this.moduleConfig.io.push ( {
        id : id,
        type : "Switch",
        pos : {
          x : x,
          y : y
        },
        values : values
      } );
      gui.io[ this.ioId ][ id ] = {
        value : values[ 0 ],
        callBack : callBack
      };
    } else {
      log.warn( 'addSwitch: ', 'Ignored, values should be an array!' );
    }
  }
  
  io.addStaticLabel = function( text, x, y ) {
    var label = null
    if ( text && x && y ) {
      label = { id:'label'+(lId++), type:'Label', label:text, pos: { x:''+x, y:''+y } }
      this.moduleConfig.io.push( label )
    } 
    return label
  }
  
  // add general config obj
  io.addIoElementConfig = function( config, callback ) {
    if ( config ) { 
      this.moduleConfig.io.push ( config ) 
      if ( callback && config.id ) {
        gui.io[ this.ioId ][ config.id ] = {
          value : null,
          callBack : callback
        }
      }
    }
  }
  
  return io
}
var lId = 0

// ----------------------------------------------------------------------------
// security

/** add pong-security plug in to header */
gui.enableSecurity = 
  function enableBasicAuth( paramObj ) {
    gui.secParams = {}
    if ( ! gui.loginTimeout ) { gui.loginTimeout = 6400000 }
    var root = ( this.appRoot== '/' ? '' : this.appRoot ) 
    if ( ! paramObj ) {paramObj = {} }
    gui.secParams.loginURL = ( paramObj.loginURL ? paramObj.loginURL : root+'/login' )
    gui.secParams.loginPage = ( paramObj.loginPage ? paramObj.loginPage : 'main' )
    gui.secParams.registgerURL = ( paramObj.registgerURL ? paramObj.registgerURL : null )
    gui.secParams.logoutPage = ( paramObj.logoutPage ? paramObj.logoutPage : 'main' )
    gui.secParams.logoutURL = ( paramObj.logoutURL ? paramObj.logoutURL : root+'/logout' )
    gui.secParams.changePasswordStrength = 4
    this.pages[ 'main' ].header.modules.push(
      { 'id': 'Sec', 'type': 'pong-security', 'param': gui.secParams }
    ) 
    log.info( "Security is enabled!" )
  }

gui.checkUserCSRFtoken = function checkUserCSRFtoken( req ) {
 if ( req.cookies && req.cookies[ 'pong-security' ] ) {
    var token = req.cookies[ 'pong-security' ]
    if ( gui.userTokens[ token ] && gui.userTokens[ token ].csrfToken ) {
      var headerToken = req.get('X-Protect') 
      var userToken = gui.userTokens[ token ].csrfToken
      if ( userToken != headerToken ) {
        return false
      }
    }
  } 
  return true
}

webservices.use( // inject CSRF token
  function( req, res, next ) {
    var csrfToken = 'default'
    if ( req.cookies && req.cookies[ 'pong-security' ] ) {
      var token = req.cookies[ 'pong-security' ]
      if ( gui.userTokens[ token ] && gui.userTokens[ token ].csrfToken ) {
        csrfToken = gui.userTokens[ token ].csrfToken
      }
    }
    res.header( 'X-Protect', csrfToken );
    next();
  } 
);

router.post(
    '/login', 
    formParser, 
    function(req, res) {
      // log.info( "POST Login ..." )
      if ( gui.authenticate != null ) {
        if ( req.body && req.body.userid ) {
          // log.info( "calling authenticate ..." )
          gui.authenticate( 
            req.body.userid, 
            req.body.password, 
            function ( err, loginOK, mustChangePassword ) {
              if ( !err && loginOK ) {
                // log.info( "Login OK" )
                res.statusCode = 200
                // todo set up "session" for user via hook
                var token = ''
                if ( gui.createToken ) { 
                  token = gui.createToken( req.body.userid ) 
                } else {
                  token = gui.mkToken( 32 ) 
                }
                // log.info( "Token: "+token )
                gui.userTokens[ token ] = { 
                  userId : req.body.userid, 
                  expires: new Date( Date.now() + gui.loginTimeout ),
                  csrfToken: gui.mkToken( 20 ) 
                } 
                res.cookie( 'pong-security', 
                    token, 
                    { //expires: new Date(Date.now() + 6400000), 
                      httpOnly: true, path: gui.appRoot }
                )
                console.log( 'this.appRoot='+gui.appRoot )
                
                if ( gui.changePassword ) {
                  gui.secParams.changePasswordURL = 
                    ( gui.appRoot=='/' ? '/password' : gui.appRoot+'/password' )
                }
                var changePassword = false
                if ( mustChangePassword ) { changePassword = true }
                res.json( { loginResult: "Login OK", changePassword: changePassword } ) 
              } else {
                // log.info( "Login failed!" )
                res.status( 401 ).send(  "Login failed" )
              }              
            }
          )
          
          
        } else if ( gui.getUserId( req ) ) {
          res.status( 200 ).send( gui.getUserId( req ) )
          return
        } else {
          // log.info( "user/password or cookie required" )
          res.status( 401 ).send( "Login failed" )          
        }
      } else {
        // log.info( "Please implement authenticate function:" )
        // log.info( " gui.authenticate = function authenticate(user,
        // password)"+
        // " { ... return true/false }")
        res.status( 401 ).send( "Login failed" )                  
      }
    }
  )

gui.mkToken = function mkToken( len ) {
  var chrs = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
  var token =''
  for ( var i = 0; i < len; i++ ) {
    var iRnd = Math.floor( Math.random() * chrs.length )
    token += chrs.substring( iRnd, iRnd+1 )
  }
  return token
}

gui.getUserId = function getUserId( req ) {
  var userId = null
  if ( req.cookies && req.cookies[ 'pong-security' ] ) {
    // log.info( "getUserId: pong-security cookie ..." )

    var token = req.cookies[ 'pong-security' ]
    // log.info( "getUserId: token = "+token )
    if ( token ) {
      if ( gui.getUserIdForToken ) {
        // log.info( "gui.getUserIdForToken..." )
        userId = gui.getUserIdForToken( token )      
      } else if ( gui.userTokens[ token ] ) {
        log.verbose( "getUserId: userId = "+gui.userTokens[ token ].userId )
        if ( Date.now() < gui.userTokens[ token ].expires ) {
          userId = gui.userTokens[ token ].userId
        } else {
          log.verbose( "getUserId: userId = "+gui.userTokens[ token ].userId+"  >>>> session expired" )
        }
      }
    }
  }
  return userId
}

/** returns null, if not logged in */
gui.getLoggedInUserId = function getLoggedInUserId( req ) {
	var uid = null 
	if ( req.cookies && req.cookies[ 'pong-security' ] ) {
		var token = req.cookies[ 'pong-security' ]
		if ( gui.userTokens[ token ] ) {
			// log.info( "getUserId: userId = "+gui.userTokens[ token ] )
      if ( Date.now() < gui.userTokens[ token ].expires ) {
			  uid = gui.userTokens[ token ].userId
      }
		}
	}
	return uid
}

// Change Password ReST Service
router.post(
    '/password', 
    formParser, 
    function(req, res) {
      // log.info( "POST Login ..." )
      var userId = gui.getLoggedInUserId( req )
      if ( userId ) {
        if ( gui.changePassword != null ) {
          if ( req.body && req.body.oldPassword && req.body.newPassword ) {
            var oldPwd = req.body.oldPassword
            var newPwd = req.body.newPassword
            gui.changePassword( userId, oldPwd, newPwd,
               function( err, result ) {
                  //log.info( "callback", "err:"+err+" result:"+result )
                  if ( result ) {
                    res.status( 200 ).send( "Password changed!" )                 
                  } else {
                    res.status( 400 ).send( "Failed to change password!" )              
                  }
              }
            )
          } else {
            res.status( 400 ).send( "Invalid request!" )                              
          }
          // TODO
        } else {
          res.status( 405 ).send( "Failed to change password!" )                  
        }
      } else {
        res.status( 401 ).send( "Login invalid!" )                                    
      }
    }
)

// logout ReST service
router.post(
    '/logout', 
    formParser, 
    function(req, res) {
      // log.info( "POST Logout ..." )
      // log.info( 'Cookies: ', req.cookies )
      if ( req.cookies && req.cookies[ 'pong-security' ] ) {
        // log.info( "pong-security cookie ..." )

        var token = req.cookies[ 'pong-security' ]
        // log.info( "token = "+token )
        // log.info( "user = " + gui.userTokens[ token ] )
        if ( gui.deleteUserIdForToken ) {
          gui.deleteUserIdForToken( token )
        } else if ( gui.userTokens[ token ] ) {
          delete gui.userTokens[ token ]
        }
      }
      if ( req.session ) {
        req.session.destroy() 
      }
      res.clearCookie( 'pong-security', { path: gui.appRoot } )
        .status( 200 ).send( "" )
    }
  )
  
