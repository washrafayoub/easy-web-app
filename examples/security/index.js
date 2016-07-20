var gui     = require( '../../' )     // stand alone: replace with  require( 'easy-web-app' ) 
var express = require( 'express' )
var log = require('npmlog');

log.info( __dirname )

// define a main page
var mainPage = gui.init()
mainPage.title = 'Security Demo'
mainPage.header.logoText = 'Security Demo'

mainPage.addView( { 'id':'row1view', 'title':'Login with user "test"', 'height':'300px' } )

gui.enableBasicAuth( )

gui.authenticate =  
  function authenticate( user, password) {
    log.info( "login "+user )
    return true
  }