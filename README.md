Create web applications easily. 

This is Node.js API for the "rest-web-gui" framework.

Sample Node.js code to create a page with a form to add customers and a result view:

	// initialize:
	var gui = new easyWebGui.Page();
	
	// create a Form an link it to the "/customer" REST service
	var form = gui.addView( "Search Customers", easyWebGui.baseForm );	
	
	// define some inputs, c1 means 1st column, c2 ... I think you got it ;-) 
	form.easyFormField.push( "c1|Name" );							
	form.easyFormField.push( "c1|Email" );  						
	form.easyFormField.push( "c2|Web Page" );  						
	form.easyFormField.push( "c2|Phone" );
	  						
	// add a action button, doing a HTTP GET to the service ULR "/customer"
	form.action.push( { "id":"AddCustomer", "actionName": "Add Customer", "method":"POST" ,"actionURL": "/customer", "taget": "actionResult" );
	
	var status = gui.addView( "Web Service Response");	
 	status.setId( "actionResult" ); 	// this ID is referenced by the form, to set the response of the REST web service request
	