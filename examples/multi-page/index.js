/** Simple example: Create a web page with form */

var gui = require('../../');

/** Initialize the framework and the default page */
gui.init();

/** Add an empty view to the default page. */
gui.addView( { 'id':'myFirstView' } ); 

/** Add a second page page. */
gui.addPage( 'secondpage' );
/** Add an empty view to the second page page. */
gui.addView( { 'id':'viewOnSecondPage' }, null, 'secondpage' ); 