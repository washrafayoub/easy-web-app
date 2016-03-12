
var gui = require('../../');

/** Initialize the framework and the default page */
gui.init();

const on = 1, off = 0;

// create a IO view on page
var ioView = gui.addIoView();

// change update speed to 1 sec (= 1000 ms)
ioView.setUpdateMilliSec( 10000 );

// add a "LED" at x/y 100px/100px and stich it to "on" (=1)
var led = on;
ioView.addLED( "myFirstLED", 100, 100, led );


// toggle led on/off every 2 secs
//setInterval( 
//	function toggleLED() {
//		led = ( led==on ? off : on );
//		ioView.setLED( "myFirstLED", led );
//	}, 
//	2000 );

ioView.addSwitch( "mySwitch", 100, 200, ["on","off"] );