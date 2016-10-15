var gui = require( '../../' )     // stand alone: replace with  require( 'easy-web-app' ) 

// Initialize the framework and the default page

var icons = { id:'nav1', title:' ', width:'7% ', type:'pong-icons' }
var iconNav =
  { icons:[
        { layout:"main",  label:"Main", img:"img/p01w.png" },
        { layout:"page2", label:"Page 2", img:"img/p02w.png" },
        { layout:"page3", label:"Page 3", img:"img/p03w.png" }
     ]
  }

// -------------------------------------------------------------
// main page

var mainPage = gui.init()
mainPage.title = 'Icon Navigation Demo'
mainPage.header.logoText = 'Icon Navigation Demo'
mainPage.header.modules = [] // removes nav-bar module

var columns = mainPage.addColumnsRow( 'row3', '600px' )
var nav = columns.addView( icons, iconNav )
nav.decor = null
// do business logic here:
columns.addView( { 'id':'col1view', 'title':'Main Page', 'width':'93%' } )
  

// -------------------------------------------------------------
// page 2

var page2 = gui.addPage( 'page2', 'Page 2' )
var p2columns = page2.addColumnsRow( 'row3', '600px' )
var nav = p2columns.addView( icons, iconNav )
nav.decor = ''

// do business logic here:
p2columns.addView( { 'id':'col1view', 'title':'Page 2', 'width':'93%' } )


// -------------------------------------------------------------
// page 3

var page3 = gui.addPage( 'page3', 'Page 3' )
var p3columns = page3.addColumnsRow( 'row3', '600px' )
var nav = p3columns.addView( icons, iconNav )
nav.decor = ''

// do business logic here:
p3columns.addView( { 'id':'col1view', 'title':'Page 3', 'width':'93%' } )
