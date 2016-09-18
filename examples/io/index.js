const LED_GREEN = 1, LED_OFF = 0, SWITCH_ON = 'on', SWITCH_OFF = 'off'

var gui = require( '../../' )     // stand alone: replace with  require( 'easy-web-app' ) 
var log = require( 'npmlog' )

// Initialize the framework and the default page
gui.init( 'I/O')
  
// create a IO view on page
var ioView = gui.addIoView()

// change update speed to 1 sec (= 1000 ms)
ioView.setUpdateMilliSec( 10000 )
ioView.setBackgroundImage(  __dirname + '/demo.png' )

// add a 'LED' at x/y 100px/100px and switch it to 'on' (=1)
var led = LED_GREEN
ioView.addLED( 'myFirstLED', 300, 210, led )

ioView.addSwitch( 
    'mySwitch',                   // the ID
    60, 85,                       // x,y pos of switch
    [ SWITCH_ON, SWITCH_OFF ],    // possible values
    function ( switchValue ) {
      log.info( 'Switch "mySwitch"', 'now %j', switchValue );
      if ( switchValue == SWITCH_ON ) {
        ioView.setLED( 'myFirstLED', LED_GREEN );
      } else {
        ioView.setLED( 'myFirstLED', LED_OFF );
      }
    } 
)