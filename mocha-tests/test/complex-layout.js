
//use zombie.js as headless browser
var Browser = require('zombie');
var assert = require('assert');
var app = null
describe( 
  'Complex-Layout example page', 
  function() {
  
    before( 
        function() {
          app = require('../../examples/complex-layout');
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
          this.browser.assert.text( 'h1', 'Complex Layout Demo' );
          this.browser.assert.element( 'div.copyright-div' );
        }
    );  
    
    it( 'should show complex layout', 
      function() {
          this.browser.assert.success();
          this.browser.assert.text( 'div#row1viewTitle', 'Row 1 View' );
          this.browser.assert.text( 'div#row2viewTitle', 'Row 2 View' );
          this.browser.assert.text( 'div#row1viewTitle', 'Row 1 View' );
        }
    );  
    
  }
);