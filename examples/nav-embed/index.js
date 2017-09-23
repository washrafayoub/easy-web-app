var gui = require ( '../../' )
var express = require( 'express' )

// stand alone: replace with  require( 'easy-web-app' )
gui.getExpress().use( '/css-custom', express.static( __dirname ) )

// initialize the web app framework and a default main page
var mainPage = gui.init ( 'Menu Demo', 8888, '/', { nav: 'embedded' }  )
mainPage.title = 'Page ABC' // replace default = "main"
mainPage.addView ( { id : 'Page abc' }, null )

/** Add a 2nd page page. */
var page2 = gui.addPage( 'secondpage', 'Page XYZ',  { id:'Page xyz' }, null )
page2.addInfo( 'New' )

/** Add a 3rd page page.... */
var page3 = gui.addPage( 'myMenu', 'Has Sub Pages' )
page3.addSubNav()
page3.addView( { id:'Page 1' } )

/** ... and sub pages of the 3rd page: */
var page3a = gui.addPage( 'myMenu/foo', 'Sub Page 1a' )
page3a.addSubNav()
page3a.addView( { id:'Page 1a' } )

var page3b = gui.addPage( 'myMenu/barb', 'Sub Page 1b' )
page3b.addSubNav()
page3b.addView( { id:'Page 1b' } )
page3b.addInfo( '42' )

var page3c = gui.addPage( 'myMenu/barc', 'Sub Page 1c' )
page3c.addSubNav()
page3c.addView( { id:'Page 1c' } )

var page3d = gui.addPage( 'myMenu/bard', 'Sub Page 1d' )
page3d.addSubNav()
page3d.addView( { id:'Page 1d' } )

/** Add a page page and exclude from nav view. */
var page2 = gui.addPage( 'exclpage-nonav', 'Page XYZ',  { id:'Page xyz' }, null )
page2.addInfo( 'New' )

