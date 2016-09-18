var gui     = require( '../../' )     // stand alone: replace with  require( 'easy-web-app' ) 
var log = require('npmlog');

// define a main page
var mainPage = gui.init( 'Security Demo', 8080, 'securitydemo' )
mainPage.title = 'Home'
mainPage.header.logoText = 'Security Demo'
mainPage.addView( { 'id':'row1view', 'title':'Login with any (non empty) user id', 'height':'300px' } )

// let's create a hidden page -- only available for logged in users
var secretPage = gui.addPage( 'secretPage', 'Private Page',  
    { id:'DataTable', type:'pong-easytable', resourceURL:'/securitydemo/products' },
	  {
	    dataURL:'',
	    easyCols: [ 'Name', 'Rating' ]
	  }
 )

// switch securiy on:
gui.enableSecurity()

// "auth" is ok if any user id is given
gui.authenticate =  
  function authenticate( user, password, callback ) {
    log.info( 'Login user "'+user+'"' )
    if ( ! user ) {
      callback( null, false )
    } else {
      callback( null, true )
    }
  }

gui.changePassword =  
  function changePassword( user, oldPasswprd, newPassword, callback ) {
    log.info( 'Change password for "'+user+'"' )
    callback( null, true )
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

// pull down menu

// now add the pull down menu:
gui.addPullDownMenu( 'testMenu', 'Menu' )
// add static HTML dummy content to menu:
gui.addPullDownMenuHtmlItem( 'testMenu', 'Test 1' )
gui.addPullDownMenuHtmlItem( 'testMenu', 'Test 2' )

// by defining this as subpage of "user", the link will appear in the user security menu
var profilePage = gui.addPage( 'user/profile', 'User Profile',  { id:'User Profile' }, null )
var profilePage = gui.addPage( 'user/settings', 'Preferences',  { id:'Preferences' }, null )


// now we need to implement the ReST service for /products 
// this should also only be available for authenticated users
var svc  = gui.getExpress()
svc.get( 
  '/products', 
  function( req, res ) {
    if ( gui.getLoggedInUserId( req ) ) {
      log.info( 'products service', 'user is logged in' )
      // generate some dummy data:
      var tableData = 
        [ 
         {"Name":"Product AB","Rating":"3"},
         {"Name":"Product 1","Rating":"2"},
         {"Name":"XYZ Product","Rating":"1"},
         {"Name":"My Product","Rating":"1"},
         {"Name":"Secret Product 1","Rating":"2"},
         {"Name":"Secret Product 2","Rating":"0"},
         {"Name":"Product XYZ","Rating":"0"},
         {"Name":"My Prod","Rating":"0"},
         {"Name":"Your Prod","Rating":"3"},
         {"Name":"Other Product","Rating":"1"},
         {"Name":"Just a Product","Rating":"2"}
        ]
      res.status( 200 ).json( tableData )  		
  	} else {
    	log.info( 'products service', 'not allowed for unauthenticated users' )
      res.status( 401 ).send( "You must login first!!"  )  		  		
    }
  }
)



/* Optional hooks for HA environment, typically using a distributed cache or a DB
gui.createToken = function createToken( userId ){
  //TODO: implement for HA cluster
  return token 
}

gui.getUserIdForToken = function getUserIdForToken( token ){
  //TODO: implement for HA cluster
  return userId
}
gui.deleteUserIdForToken = function gui.deleteUserIdForToken( token ) {
  // TODO: implement for HA cluster
}
*/