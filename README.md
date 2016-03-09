# Easy Web App
Create web applications easily. 

This is a Node.js API for the [rest-web-gui](https://github.com/ma-ha/rest-web-ui) framework.

Focus is on _web applications_ (not simple web pages). Ready to use plug-ins for interactive
* forms
* tables / lists
* content
* I/O: control switches/drawer, gauges, graphs, LEDs, displays, ...
* i18n: switch language
* maps: POIs, routes, traffic, ...
* page to page navigation with navigation tabs, menus, links and session data
* source code display
* basic OAuth security

Check out [rest-web.gui](https://github.com/ma-ha/rest-web-ui/) for some demos and docu of all features.

## Compared with ...
* jade
  * descriptive, but low level
  *  more focus to simplify the creation of web pages, not applications
* angular 
  * can do everything, but programming is required

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

Full example: [simple form](https://github.com/ma-ha/easy-web-app/blob/master/examples/simple/index.js)

	
## 20 sec Test
Requires [node.ns installed](https://nodejs.org/en/download/) -- which is always a good idea to have it.

Get a local copy and start example:

	git clone https://github.com/ma-ha/easy-web-app.git
	cd easy-web-gui/examples/simple
	npm install express --save
	nodejs index.js

Open GUI: http://localhost:8888/ in your Browser
	