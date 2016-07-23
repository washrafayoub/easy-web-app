/** Simple example: Create a web page with form */

var gui = require ( '../../' )
// stand alone: replace with  require( 'easy-web-app' )

// initialize the web app framework and a default main page
var mainPage = gui.init ( 'Menu Demo' )
mainPage.title = 'Page ABC' // replace default = "main"
mainPage.addView ( { id : 'Page abc' }, null )

/** Add a 2nd page page. */
var page2 = gui.addPage( 'secondpage', 'Page XYZ',  { id:'Page xyz' }, null )

/** Add a 3rd page page. */
// The page name is an URL and you can define a sub-menu like  
// this "myMenu" as name. If you need a non URL conform name 
// (e.g. "My Menu" with spaces etc.) you can use the i18n 
// feature to map technical labels in any language. 
var page3 = gui.addPage( 'myMenu/foo', 'Sub Page 1', { id:'Page 1' } )

/** Add a 4th page page. */
var page4 = gui.addPage( 'myMenu/bar', 'Sub Page 2',{ id:'Page 2' }, null )