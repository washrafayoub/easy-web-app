# Easy Web App
Create web applications easily. 

This is a [Node.js API package](https://www.npmjs.com/package/easy-web-app) 
for the [rest-web-gui](https://github.com/ma-ha/rest-web-ui) framework.

Focus is on _web applications_ (not simple web pages). 
A lot of plug-ins are available to get a portal it quickly configured:
* Forms, Tables, Lists, Trees, Histograms
* Content: via MediaWiki API, plain HTML views, RSS-/atom-feeds or help dialogs
* I/O: control switches/drawer, gauges, graphs, LEDs, displays, ...
* i18n: switch language
* Maps: POIs, routes, traffic, ...
* Page to page navigation with navigation tabs, menus, links and session data
* Source code display
* Security: RESTful, HTTP Basic or OAuth authentication support, "Change Password" dialog with policy check
* ...

This is how it may look like:
![demo screen shot](http://bit.ly/rest-web-gui-screenshot) 

Have a look at the "list" [example](https://github.com/ma-ha/easy-web-app/tree/master/examples/list):
![list demo screen shot](https://raw.githubusercontent.com/ma-ha/easy-web-app/master/examples/list/pong-list.png) 


Check out [docu on "rest-web-gui" GIT project](https://github.com/ma-ha/rest-web-ui/), 
the [examples](https://github.com/ma-ha/easy-web-app/tree/master/examples/)
and the [online demos](http://mh-svr.de/pong_dev) of all features.


Check "[Release Notes](https://github.com/ma-ha/easy-web-app/blob/master/ReleaseNotes.md)" for latest changes in this version.

## Compared with ...
* jade
  * jade is descriptive, but low level (HTML structure)
  * jade is perfect for web pages, not for web applications
* angular 
  * angular can do everything, but JS programming is required 
* react
  * build web apps with JavaScript in a component way -- but not descriptive

They can all work behind the scenes, i.e. for view plug-ins. 

## 20 sec Test
Requires [node.ns installed](https://nodejs.org/en/download/) -- 
which is always a good idea to have it.

Get a local copy and start example:

```bash
git clone https://github.com/ma-ha/easy-web-app.git

cd easy-web-gui
npm install
 
cd examples
cd simple
node index.js
```

Now open the web app in your browser: [http://localhost:8888/](http://localhost:8888/)
	
## How does it work
To create a web page with one view you simple do:

```javascript
// initialize:
var gui = require ( 'easy-web-app' )

// start REST services and create a main page
gui.init()  

// Create a form view on the main page:
gui.addView( 
	{ ... view config JSON ... },
	{ ... plug in config JSON ... } 
)
```

You'll find the full example here:
[simple form](https://github.com/ma-ha/easy-web-app/blob/master/examples/simple/)

The idea is to define "page" containing different "views" in a JSON format and a "portal" as a set of "pages".
This little package helps you to create the JSON configuration and 
to set up [REST](https://en.wikipedia.org/wiki/Representational_state_transfer) 
web service to provide the page specification to the browser.

The JSON config of a whole page looks this way:
* `title`: a simple String
* `header` object
  * `logoText` (String) or `logoURL` (String) 
  * `modules`: Array of header plug-ins and their configuration
* `rows`: an array of "views" or "columns" and their configuration 
* `footer`
  * `copyrightText` String 
  * `modules`:  Array of footer modules and configurations for them

Inside the browser this is rendered to a full featured web app by
[the "rest-web-gui" JavaScript framework and it's plug-ins](https://github.com/ma-ha/rest-web-ui/) -- magic!!

Of course you may need to customize the CSS themes. You can also develop your own JavaScript view plug-ins.

All tested browsers and devices works fine (special layouts for mobile phones and tablets is now a feature):

![demo screen shot](https://raw.githubusercontent.com/ma-ha/easy-web-app/master/examples/gui-on-devices-s.png) 


## First project (< 1 min)
Requires [node.ns installed](https://nodejs.org/en/download/) -- 
it really don't hurt and it's always a good idea to have.

Create a demo folder and install _easy-web-app_ via _npm_

```bash
mkdir demo
cd demo
npm install easy-web-app
```

Create a _simpleForm.js_ file with following content 
(this is the [form example](https://github.com/ma-ha/easy-web-app/blob/master/examples/simple/index.js)):

```javascript
/** Simple example: Create a web page with form */
var gui = require ( 'easy-web-app' )

/** Initialize the framework, the default page and define a title */
gui.init ( 'My 1st Test' )

/**
 * Add a view of type "pong-easy-form" (= plug-in) to the default page the first
 * parameter of addView is the view configuration, a second parameter can define
 * the plug-in configuration, a third parameter can specify the page.
 */
gui.addView ( 
  {
    'id'   : 'myFirstView',
    'type' : 'pong-easyform'
  },
  {
    "id" : "tstFormId",
    "easyFormFields" : [ 
        "id"
      , "c1|Name"
      , "c1|Date|date"
      , "c1|separator"
      , "c1|Remark|3rows"
      , "c2|Mailings|label"   // second starts here column
      , "c2|Send~Ads~~|checkbox_infomails_ads"
      , "c2|Newsletter|checkbox_infomails_newsletter"
      , "c2|Pass~Word" 
    ],
    "actions" : [ 
      {
        "id" : "Chk",
        "actionName" : "Check",
        "actionURL"  : "svc/test/check"
      }
    ]
  }
)
```

Run the demo:

	npm install easy-web-app
	node simpleForm.js
	
Open the URL [http://localhost:8888/](http://localhost:8888/) in your Browser.

Remark: To keep this demo simple, there is no REST web service for the 
"Check" button shown here. 


## Examples and API Reference
Have a look at [some feature demos](https://github.com/ma-ha/easy-web-app/tree/master/examples/),
which also contains a form tutorial.

The [API Reference](https://github.com/ma-ha/easy-web-app/blob/master/API-Reference.md)
contains all JS API and all implemented REST web services.

## Feedback and Support
Please tell me what you like and what I need to improve! I'm also interested in use cases you do. 

Please contact me: 

![email address](https://raw.githubusercontent.com/ma-ha/easy-web-app/master/email.png) 

How can I help you?