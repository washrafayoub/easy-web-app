# Easy Web GUI
Create web applications easily. 

This is a Node.js API for the [rest-web-gui](https://github.com/ma-ha/rest-web-ui) framework.

## 20 sec Test
Get a local copy and start example:

	git clone https://github.com/ma-ha/easy-web-gui.git
	cd easy-web-gui/examples/simple
	npm install express --save
	nodejs simple.js


## Node.js example
This creates a web page with a form view to add customers and a result view:

	// initialize:
	var gui = new easyWebGui.Page();
	
	// create a Form an link it to the "/customer" REST service
	var form = gui.addView( "Search Customers", easyWebGui.baseForm );	
	
	// define some input fields, c1 means 1st column, c2 ... I think you got it ;-)
	// by default all inputs are text inputs -- but there is some "intelligency" for some key words 
	form.easyFormField.push( "c1|Name" );							
	form.easyFormField.push( "c1|Email" );  						
	form.easyFormField.push( "c2|Web Page" );  						
	form.easyFormField.push( "c2|Birthday" );
	  						
	// add a action button, doing a HTTP GET to the service ULR "/customer"
	form.action.push( { "id":"AddCustomer", "actionName": "Add Customer", "method":"POST" ,"actionURL": "/customer", "taget": "actionResult" );
	
	var status = gui.addView( "Web Service Response");	
 	status.setId( "actionResult" ); 	// this ID is referenced by the form, to set the response of the REST web service request
	
	
