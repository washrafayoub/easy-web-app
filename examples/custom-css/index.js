var gui     = require( '../../' )     // stand alone: replace with  require( 'easy-web-app' ) 
var express = require( 'express' )
var log = require('npmlog');

log.info( __dirname )
gui.decor = 'tedge'

// define to load /css-custom/custom.css from local folder
gui.getExpress().use( '/css-custom', express.static( __dirname ) )
gui.getExpress().use( '/img-cust', express.static( __dirname + '/img-cust' ) )
  

// define a main page
var mainPage = gui.init( 'Customize CSS Demo', 8880, '/test/test' )
mainPage.setTitle( 'Customize CSS Demo' )
mainPage.setLogoURL( 'img-cust/funnyLogo.png' )
mainPage.setPageWidth( '90%' )
  
mainPage.addView( { 'id':'row1view', 'title':'Row 1 View', 'height':'100px' } )
mainPage.addView( { 'id':'row2view', 'title':'Row 2 View', 'height':'300px' } )
