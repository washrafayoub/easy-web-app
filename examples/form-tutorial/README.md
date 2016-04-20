# Form Tutorial
The form plug in is complex and may be main functionality of a page. 

Therefore I will explain the usage scenarios step by step.

There is a wrapper for _form_ plugin called _easy-form_. 
But let's understand _form_ first, before doing short cuts.

## General definition of the form view 
To set up a page with a form you need the following code:

```javascript
var gui = require( 'easy-web-app' )   
gui.init ( 'Form Tutorial: Page 1' )

var viewConfig = {
    id   : 'myForm',
    title: 'Form View',
    type : 'pong-form'    
  }
  
var plugInConfig = {
    id: 'myFormDef',
    description: "shows first form",
    fieldGroups: [
        {
            columns: [
                {
                    formFields: [
                        {
                            id:    "field1",
                            label: "Say",
                            type:  "text",
                            defaultVal: "Hello world!"
                        }
                    ]
                }
            ]
        }
    ]
  }
  
gui.addView ( viewConfig, plugInConfig ) 
```
The first line imports the _easy-web-app_ module.

The second line initialize _easy-web-app_ module and 
starts a web server with an empty "page" called 'Form Form Tutorial: Page 1'.

Using the command `gui.addView ( viewConfig, plugInConfig )`  you add a new row with a _form_ view.
Indicating inside the `viewConfig` the plug-in `type:'pong-form'` the framework will load and initialize a form.  

The 'plugInConfig' defines the parameter for the plug in, here it initializes a form with one field.
It seems to be complex to have one field inside _formFields_ array, which is in a _columns_ array,
in a _fieldGroups_ array, but this gives maximum flexibility. 
A simpler way is to use _easy-form_ as wrapper for the _form_, but it has it's limitations.

To run this code open a command terminal, change into the `examples/form-tutorial` directory and run

    node form-tutorial_1.js

If you put this into a stand alone index.js you need to do

    npm install easy-web-app
    node index.js

If you open the URL http://localhost:8888 in your browser therResult will look like this:
![form tutorial screen shot](https://raw.githubusercontent.com/ma-ha/easy-web-app/master/examples/form-tutorial/form_tutorial_1.png) 

Of course this form is not very useful, because no action is defined. 

## Action: Post data to a service 
The basic structure of the code is the same as above, we only need to modify the `plugInConfig`:

```javascript
...
var plugInConfig = {
    id: 'myFormDef',
    description: "shows second form",
    fieldGroups: [
        {
            columns: [
                {
                    formFields: [
                        {
                            id:    "field1",
                            label: "Say",
                            type:  "text",
                            defaultVal: "Hello world!"
                        }
                    ]
                }
            ]
        }
    ],
    actions: [
        {
            id: 'myBtn',
            actionName: 'Send greetings',
            method: 'POST',
            actionURL: 'test'
        }
    ]
  }
...
```

By adding the `actions` array with the _myBtn_ the form will have a POST button. 
Pressing the button a POST request to `http://localhost:8888/test` is performed. 
The page looks like this:

![form tutorial screen shot](https://raw.githubusercontent.com/ma-ha/easy-web-app/master/examples/form-tutorial/form_tutorial_2.png) 
 
The browser network debugger ("F12" is my friend) shows the request to the `http://localhost:8888/test` 
-- of course it fails, because no service is implemented to respond at this URL.

## Post action result -- show it in another view
TODO

## Load form fields by after page loading
TODO



