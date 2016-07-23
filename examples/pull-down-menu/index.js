/** Simple example: Create a web page with form */

var gui = require ( '../../' )
// stand alone: replace with  require( 'easy-web-app' )

// initialize the web app framework and a default main page
var mainPage = gui.init ( 'Menu Demo' )
mainPage.title = 'Home' // replace default = "main"
mainPage.addView ( { id : 'Page 1' }, null )

// now add the pull down menu:
gui.addPullDownMenu( 'testMenu', 'Menu' )

/** Add a 2nd page page. */
var page2 = gui.addPage( 'testMenu/secondpage', 'Page 2',  { id:'Page 2' }, null )

/** Add a 3rd page page. */
var page3 = gui.addPage( 'testMenu/thirdpage', 'Page 3', { id:'Page 3' } )

/** Add a 4th page page. */
var page4 = gui.addPage( 'testMenu/fourthpage', 'Page 4',{ id:'Page 4' }, null )