WEB_SERVER_PORT = 9893;

//use zombie.js as headless browser
var Browser = require('zombie');
var assert = require('assert');
var app = null
describe( 
  'Security example page', 
  function() {
  
    before( 
        function() {
          app = require('../../examples/security');
          //this.server = http.createServer(app).listen(3000);
          // initialize the browser using the same port as the test application
          this.browser = new Browser({ site: 'http://localhost:'+WEB_SERVER_PORT+'/' });
        } 
    );
    
    // load the contact page
    before(
        function( done ) {
          this.browser.visit( '/securitydemo/', done);
        }
    );
    
    it( 'should show the header and footer', 
      function() {
          this.browser.assert.success();
          this.browser.assert.text( 'h1', 'Security Demo' );
          this.browser.assert.element( 'div.copyright-div' );
        }
    );  

    it( 'should not show the private tab', 
      function() {
          //this.browser.assert.element( '#navTabsecretPage' );
        }
    );  

    describe( 'authorized flow', function() {

      before(function(done) {
        this.browser.clickLink( '.PongLogin' )
        this.browser.fill( '#useridInput', 'test1').pressButton('Login', done);
      })
      it( 'must show the private page after login', 
        function() {
            this.browser.assert.element( '#navTabsecretPage' );
          }
      )  

    })
    
  }
);