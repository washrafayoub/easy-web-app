/* Mobile/Tablet Detection Example.  */
var gui = require( '../../' )     // stand alone: replace with  require( 'easy-web-app' ) 
var log = require( 'npmlog' )

// Initialize the framework and the "main" page for normal browsers
var mainPageNormal = gui.init()
mainPageNormal.title = 'Demo'
mainPageNormal.header.logoText = 'Mobile-Detect Demo'
mainPageNormal.addView( { 'id':'row1view', 'title':'Normal Browser Page', 'height':'600px' } )

// Add a "main" page for tablet browsers
var mainPageTablet = gui.addPage( 'main-t', 'Demo',  { id:'Tablet Page' }, null )
// The -t and -m are ignored for the menu tabs

// Add a "main" page for tablet browsers
var mainPageMobile = gui.addPage( 'main-m', 'Demo',  { id:'Mobile Phone Page' }, null )

// this will generate a menu tab
var otherPageNormal = gui.addPage( 'other', 'Other Page',  { id:'Normal Page' }, null )
// this will NOT generate a menu tab
var otherPageTablet = gui.addPage( 'other-t', 'Other Page',  { id:'Tablet Page' }, null )
// this will NOT generate a menu tab
var otherPageMobile = gui.addPage( 'other-m', 'Other Page',  { id:'Mobile Page' }, null )
