/** Simple example: Create a web page with form */

var gui = require('../../');

/** Initialize the framework and the default page */
gui.init();

/** Add a view of type "pong-easy-form" (= plug-in) to the default page 
    the first parameter of addView is the view configuration,
    a second parameter can define the plug-in configuration,
    a third parameter can specify the page. */
gui.addView(  
		{ 'id':'myFirstView', 'type':'pong-easyform' },
		{
			"id":"tstFormId",
			"easyFormFields":[
				"id",
				"c1|Name",
				"c1|Date|date",
				"c1|separator",
				"c1|Remark|3rows",
				"c2|Mailings|label",
				"c2|Send~Ads~~|checkbox_infomails_ads",
				"c2|Newsletter|checkbox_infomails_newsletter",
				"c2|Pass~Word"
			],
			"actions":[
				{
					"id":"Chk",
					"actionName":"Check",
					"actionURL":"svc/test/check"
				}
			]
		}
	); 