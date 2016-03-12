/** Simple example: Create a web page with form */

var gui = require( '../../' )

/** Initialize the framework and the default page */
gui.init()
gui.pages['main'].title = '1st Page'

/** Add an empty view to the default page. */
gui.addView( { 'id':'myFirstView' } ) 

/** Add a second page page. */
gui.addPage( 'secondpage' )
gui.pages['secondpage'].title = '2nd Page'

/** Add an empty view to the second page page. */
gui.addView( 
    { 'id':'viewOnSecondPage' }    // view definition
  , null                           // no view plug-in config 
  , 'secondpage'                   // page ID to add that view
)
