
var gui = require( '../../' )     // stand alone: replace with:  require( 'easy-web-app' ) 
var log = require( 'npmlog' )

// Initialize the framework and the default page
var page = gui.init()
page.header.logoText = 'Internationalization Demo'

page.header.modules.push( 
  { 
    'id': 'LangSel'
    ,'type': 'i18n'
    ,'param': { 'langList': [ 'US','EN','DE' ] }     // need other languages? try it
  }
)
  
// create aIO view on page
gui.addView( 
  { 'id':'tst', 'title':'Test Language Support'}
)
  
// set up a web service for a translation list
var svc = gui.getExpress()
svc.get(
  '/i18n/:lang',
  function( req, res ) {
    if ( req.params.lang  ) {
      if ( req.params.lang == 'DE.json' ) {
        // the language map is a key/value object, key is the default label
        res.json( 
            { 
              'Test Language Support':'Test f&uuml;r Sprachunterst&uuml;tzung'
              ,'powered by <a href="https://github.com/ma-ha/rest-web-ui">ReST-Web-GUI</a>':
                'betrieben mit <a href="https://github.com/ma-ha/rest-web-ui">ReST-Web-GUI</a>'
              ,'Internationalization Demo':'Sparch Demo'
            } 
        )      
      } else if ( req.params.lang == 'EN.json' ) {
        // the language map is a key/value object, key is the default label
        res.json( 
            { 
              'Internationalization Demo':'Internationalisation Demo'
            } 
        )      
      } else if ( req.params.lang == 'XYZ.json' ) {
          // you can try to add another langugage -- guess what you need to do?
          res.json( 
              { 
                'Test Language Support':'...'
                ,'powered by <a href="https://github.com/ma-ha/rest-web-ui">ReST-Web-GUI</a>':
                  '...'
                ,'Internationalization Demo':'...'
              } 
          )      
      } else {
        res.json( {} ) // don't offer any translations
      }
    } else {
      res.json( {} ) // don't offer any translations
    }
  }
)
 
