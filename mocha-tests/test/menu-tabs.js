
//use zombie.js as headless browser
var Browser = require('zombie');
var assert = require('assert');
var app = null
describe( 
  'Menu demo example page', 
  function() {
  
    before( 
        function() {
          app = require('../../examples/menu-tabs');
          //this.server = http.createServer(app).listen(3000);
          // initialize the browser using the same port as the test application
          this.browser = new Browser({ site: 'http://localhost:8888/' });
        } 
    );
    
    // load the contact page
    before(
        function( done ) {
          this.browser.visit( '/', done);
        }
    );
    
    it( 'should show the header and footer', 
      function() {
          this.browser.assert.success();
          this.browser.assert.text( 'h1', 'Menu Demo' );
          this.browser.assert.element( 'div.copyright-div' );
        }
    );  
    
    it( 'should show menu tabs div', 
      function() {
          this.browser.assert.success();
          this.browser.assert.element( 'div#MainNav' );
    }
    );  
    
    it( 'should show menu ABC', 
      function() {
          this.browser.assert.success();
          this.browser.assert.link( '.pongNavBarItemActive a', 'Page ABC', 'index.html?layout=main' );
    }
    );  
    
    it( 'should show menu XYZ', 
      function() {
          this.browser.assert.success();
          this.browser.assert.link( '.pongNavBarItem a:not(.pongNavBarItemActive)', 'Page XYZ', 'index.html?layout=secondpage' );
    }
    );  
    
    it( 'should show sub menu tabs', 
      function() {
          this.browser.assert.success();
          this.browser.assert.text( '#navItem2', 'myMenu' );
          this.browser.assert.text( '#navSubMenu2', 'Sub Page 1 Sub Page 2' );
        }
    );  
    
  }
);