var gui     = require( '../../' )     // stand alone: replace with  require( 'easy-web-app' ) 
var log = require('npmlog');

// define a main page
var mainPage = gui.init()
mainPage.title = 'Home'
mainPage.header.logoText = 'Security Demo'
mainPage.addView( { 'id':'row1view', 'title':'Login with any (non empty) user id', 'height':'300px' } )

var secretPage = gui.addPage( 'secretPage', 'Private Page',  { id:'Page xyz' }, null )

// switch securiy on:
gui.enableSecurity()

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
gui.authorize =  
  function authenticate( user, page ) {
    if ( page == 'main') {
      log.info( 'All users are authorized for page "'+page+'", also "'+user+'"' )
      return true;
    }
    if ( ! user ) {
      log.info( 'User "'+user+'" is not authorized for page "'+page+'"' )
      return false
    }
    log.info( 'User "'+user+'" is authorized for page "'+page+'"' )
    return true  
  }

/*
gui.createToken = function createToken( userId ){
  //TODO: implement
  return token 
}

gui.getUserIdForToken = function getUserIdForToken( token ){
  //TODO: implement
  return userId
}
*/