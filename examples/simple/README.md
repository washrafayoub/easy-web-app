## Simple Form Example
This create a page with header, form and footer.

The [pong-easy-form](https://github.com/ma-ha/rest-web-ui/tree/master/html/modules/pong-easyform) 
type defines a form using a naming convention. 
Using c1 and c2 will define two column to group the form fields.

The example contains also a simple REST/JSON web service (template) to POST form data back.

## Run example
1. You need to [get a local copy of the easy-web gui](https://github.com/ma-ha/easy-web-app).
2. and run the set up ther `npm install easy-web-gui`
3. In this directory simply run: `nodejs index.js` 
4. Open http://localhost:8888/ in your browser

## Explained
The code is all about some easy steps:
1. load the module ```require( 'easy-web-app' )```
2. start the server and set up main ```page gui.init()```
3. add a view to the main page ```page gui.addView( <view config>, <plug in config> )```

The rest of the example defines a REST/JSON web service to handle the POST
requests from the form button.

The server (step 2) will serve some static files to the browser, 
most imporant ones are
* `http://localhost:8888/index.html`  empty page just loading the JS, CSS etc.
* `http://localhost:8888/js/portal-ng.js` the heart of the framework

Then the server will set up some REST/JSON web service which are expected 
by the client. The most importan one is to load the structure definition
of the page:
* http://localhost:8888/svc/layout/main/structure
Please click the link and have a look at the JSON structure. 
That is all about! 

