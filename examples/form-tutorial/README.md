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
    ],
  }
  
gui.addView ( viewConfig, plugInConfig ) 
```
The first line imports the _easy-web-app_ module.

The second line initialize _easy-web-app_ module and 
starts a web server with an empty "page" called 'Form Form Tutorial: Page 1'.

Using the command `'gui.addView ( viewConfig, plugInConfig )'`  you add a new row with a _form_ view.
Indicating inside the `viewConfig` the plug-in `'type':'pong-form'` the framework will load and initialize a form.  

The 'plugInConfig' defines the parameter for the plug in, here it initializes a form with one field.
It seems to be complex to have one field inside _formFields_ array, which is in a _columns_ array,
in a _fieldGroups_ array, but this gives maximum flexibility. 
A simpler way is to use _easy-form_ as wrapper for the _form_, but it has it's limitations.

To run this code open a command terminal, change into the `examples/form-tutorial` directory and run

    node form-tutorial_1.js

*) if you put this into a stand alone index.js you need to do

    npm install easy-web-app
    node index.js

Of course this form is not useful, because an action button is not defined. 

## Action: Post data to a backend 
TODO

## Post action result -- show it in another view
TODO

## Load form fields by after page loading
TODO



