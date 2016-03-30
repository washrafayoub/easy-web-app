/** Simple example: Create a web page with form */

var gui = require ( '../../' )       // stand alone: relpace with  require( 'easy-web-app' )

// initialize the web app framework and a default main page
var page1 = gui.init ()
page1.title = 'Page ABC'
page1.header.logoText = 'Page "ABC"'
page1.addView ( { id : 'abc' }, null )

/** Add a 2nd page page. */
var page2 = gui.addPage( 'secondpage' )
page2.title = 'Page XYZ'
gui.addView( { 'id':'xyz' }, null, 'secondpage')

/** Add a 3rd page page. */
var page3 = gui.addPage( 'Menu/foo' )
page3.title = 'Page XYZ'
gui.addView( { 'id':'xyz' }, null, 'menu/foo')

/** Add a 4th page page. */
var page4 = gui.addPage( 'Menu/bar' )
page4.title = 'Page XYZ'
gui.addView( { 'id':'xyz' }, null, 'menu/bar')

