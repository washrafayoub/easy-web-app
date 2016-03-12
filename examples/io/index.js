var gui = require ( '../../' );

// Initialize the framework and the default page
gui.init ();

const LED_GREEN  = 1 
    , LED_OFF    = 0
    , SWITCH_ON  = "on"
    , SWITCH_OFF = "off";

// create a IO view on page
var ioView = gui.addIoView ();

// change update speed to 1 sec (= 1000 ms)
ioView.setUpdateMilliSec ( 10000 );

// add a "LED" at x/y 100px/100px and stich it to "on" (=1)
var led = LED_GREEN;
ioView.addLED ( "myFirstLED", 200, 100, led );

ioView.addSwitch ( 
  "mySwitch",               // the ID
  100, 100,                 // x,y pos of switch
  [ SWITCH_ON, SWITCH_OFF ],  // possible values
  function(switchValue) {
    console.log ( "Switch now: " + switchValue );
    if ( switchValue == SWITCH_ON ) {
      ioView.setLED ( "myFirstLED", LED_GREEN );
    } else {
      ioView.setLED ( "myFirstLED", LED_OFF );
    }
  }
);