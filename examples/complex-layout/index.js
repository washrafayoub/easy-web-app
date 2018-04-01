/* Complex layout example. 
 Principle: page has wows, add view per row, nest columns in a row, view in columns and rows in a column.
 Result:
  ---------------------------
  |  Row 1 View             |
  ---------------------------
  |  Row 2 View             |
  ---------------------------
  |  Row 3 Cols             |
  | --------- ------------- |
  | |       | | Col 2     | |
  | | Col 1 | | --------- | |
  | | View  | | | Row X | | |
  | |       | | --------- | |
  | |       | | | Row X | | |
  | |       | | --------- | |
  | --------- ------------- |
  ---------------------------
  |  Row 4 View             |
  ---------------------------
  */
var gui = require( '../../' )     // stand alone: replace with  require( 'easy-web-app' ) 
var log = require( 'npmlog' )
var express = require( 'express' )

// Initialize the framework and the default page
var mainPage = gui.init()
mainPage.title = 'Complex Layout Demo'
mainPage.header.logoText = 'Complex Layout Demo'

mainPage.addView( { 'id':'row1view', 'title':'Row 1 View', 'height':'100px,', resourceURL:'paramtest' } )
mainPage.addView( { 'id':'row2view', 'title':'Row 2 View', 'height':'100px' } )

var columns = mainPage.addColumnsRow( 'row3', '200px' )
columns.addView( { 'id':'col1view', 'title':'Col 1 View', 'width':'40%' } )

var col2rows = columns.addRowsColumn( 'col2', '60%' )
col2rows.addView( { 'id':'rowX', 'title':'Row X', 'height':'100px' } )
col2rows.addView( { 'id':'rowY', 'title':'Row Y', 'height':'100px' } )

mainPage.addView( { 'id':'row4view', 'title':'Row 4 View', 'height':'200px', resourceURL:'test' } )
gui.getExpress().use( '/test/html', express.static( __dirname + '/test' ) )

// sinve v1.2.1 params must be passed to plain html view:
gui.getExpress().get( '/paramtest/html', (req,res) => {
  var html = 'Params:<ul>'
  for ( var param in req.query ) {
    html += '<li id="parm_'+param+'">'+param+': '+req.query[param]+'</li>'
  }
  html += '</ul>'
  res.status( 200 ).send( html )
})
