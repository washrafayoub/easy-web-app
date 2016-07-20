var gui     = require( '../../' )     // stand alone: replace with  require( 'easy-web-app' ) 
var log = require('npmlog');

log.info( __dirname )

// define a main page
var mainPage = gui.init()
mainPage.title = 'Home'
mainPage.header.logoText = 'Security Demo'
mainPage.addView( { 'id':'row1view', 'title':'Login with any (non empty) user id', 'height':'300px' } )

var secretPage = gui.addPage( 'secretPage', 'Private Page',  { id:'Page xyz' }, null )


gui.enableBasicAuth( )

// "auth" is ok if any user id is given
gui.authenticate =  
  function authenticate( user, password ) {
    log.info( "login "+user )
    if ( ! user ) {
      return false
    }
    return true
  }

// grant all to "main" page
// if user != null then "granted"
//gui.authorize =  
//  function authenticate( user, page ) {
//    log.info( 'authorize "'+user+'" for page "'+page+'"' )
//    if ( page == 'main') return true;
//    if ( ! user ) {
//      return false
//    }
//    return true  
//  }