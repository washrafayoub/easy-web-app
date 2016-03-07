# Easy Web GUI
Create web applications easily. 

This is a Node.js API for the [rest-web-gui](https://github.com/ma-ha/rest-web-ui) framework.

Focus is on _web applications_ (not simple web pages). Ready to use plug-ins for interactive
* forms
* tables / lists
* content
* I/O: controll switches/drawer, gauges, graphs, LEDs, displays, ...
* i18n: switch language
* maps: POIs, routes, traffic, ...
* page to page navigation with navigation tabs, menues, links and session data
* source code display
* basic OAuth security

## Campared with ...
* jade -- descriptive, but low level, more focus to simplify the creation of web pages
* angular -- can do everything, but programming is required

## Node.js example
This creates a web page with a form view to add customers and a result view:

	// initialize:
	var gui = require('../../');
	
	gui.init();
	
	// Create a form view:
	gui.addView( 
		{ ... view config ... },
		{ ... plug in congig ... }
	);	

Full example: [simple form](https://github.com/ma-ha/easy-web-gui/blob/master/examples/simple/index.js)

	
## 20 sec Test
Get a local copy and start example:

	git clone https://github.com/ma-ha/easy-web-gui.git
	cd easy-web-gui/examples/simple
	npm install express --save
	nodejs index.js

Open GUI: http://localhost:8888/ in your Browser
	