
var gui = require('../../');

/** Initialize the framework and the default page */
gui.init();

const ledGreen = 1, ledOff = 0,
	switchOn = "on", switchOff = "off";

// create a IO view on page
var ioView = gui.addIoView();

// change update speed to 1 sec (= 1000 ms)
ioView.setUpdateMilliSec( 10000 );

// add a "LED" at x/y 100px/100px and stich it to "on" (=1)
var led = ledGreen;
ioView.addLED( "myFirstLED", 200, 100, led );

ioView.addSwitch( 
		"mySwitch", 				// the ID 
		100, 100, 					// x,y pos of switch 
		[ switchOn, switchOff ],	// possible values
		function ( switchValue ) {
			console.log( "Switch now: "+switchValue );
			if ( switchValue == switchOn ) {
				ioView.setLED( "myFirstLED", ledGreen );
			} else {
				ioView.setLED( "myFirstLED", ledOff );
			}
		}
	);