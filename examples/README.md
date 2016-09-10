# Examples
## How to run the examples:
There are two ways to run the examples:

1. Clone the GIT repo (recommended): 
	* Do a `git clone https://github.com/ma-ha/easy-web-app.git`
	* Change into the `easy-web-app` directory
	* Run a `npm update` to load all required packages
	* Start the example: `node index.js` 
2. Run the examples stand alone: 
	* Copy the `index.js` to a local folder and change into that folder
	* Open the `index.js` in an editor and 
	  change the line 
	  	* `var gui = require ( '../../' )` 
	  	* to  `var gui = require( 'easy-web-app' )`
	* Run `npm install easy-web-app npmlog` (some examples also need `express` to be installed)
	* Start the example: `node index.js`  

After starting the example, the console log should show you a line 
```
info Web GUI http://localhost:8888/
```
Open this URL in your browser.

## First Steps
Perhaps start here:
* [Simple form explained -- showing all currently supported field types](https://github.com/ma-ha/easy-web-app/blob/master/examples/simple/)
  *  [Simple form JS source](https://github.com/ma-ha/easy-web-app/blob/master/examples/simple/index.js)
  
## View Type examples  
* [Simple form -- showing all currently supported field types](https://github.com/ma-ha/easy-web-app/blob/master/examples/simple/index.js)
* [Table demo](https://github.com/ma-ha/easy-web-app/blob/master/examples/table-demo/index.js) \*
* [Content via MediaWiki API](https://github.com/ma-ha/easy-web-app/blob/master/examples/wiki-demo/index.js)
* [I/O demo](https://github.com/ma-ha/easy-web-app/blob/master/examples/io/index.js) \*
* [Tree and Histogram demo](https://github.com/ma-ha/easy-web-app/blob/master/examples/tree/) \*

## Other Feature Demos
* [2 pages with navigation](https://github.com/ma-ha/easy-web-app/blob/master/examples/multi-page/index.js)
* [mobile phone, tablet or desktop browser detection](https://github.com/ma-ha/easy-web-app/blob/master/examples/mobile-detect/index.js)
* [how to provide a customized CSS, change the logo, etc.](https://github.com/ma-ha/easy-web-app/blob/master/examples/custom-css/index.js)
* [menu demo](https://github.com/ma-ha/easy-web-app/blob/master/examples/menu-tabs/index.js)
* [pull-down menu demo](https://github.com/ma-ha/easy-web-app/blob/master/examples/pull-down-menu/index.js)
* [i18n / internationalization / multi-language support](https://github.com/ma-ha/easy-web-app/blob/master/examples/i18n/index.js) \*
* ["complex" layout demo -- more than one view on a page](https://github.com/ma-ha/easy-web-app/blob/master/examples/complex-layout/index.js)
* [change view configuration "on-the-fly"](https://github.com/ma-ha/easy-web-app/blob/master/examples/on-the-fly-config/index.js)
* [Security: Login, logout and page authorization](https://github.com/ma-ha/easy-web-app/blob/master/examples/security/)

<sub>_Remark: (\*) includes a REST/JSON web service implementation_</sub>  

# Tutorial  
* [form tutorial](https://github.com/ma-ha/easy-web-app/blob/master/examples/form-tutorial/)

# API Reference
The API makes things simpler, but you can still work with plain JSON specifications 
to render a page. Behind the 

Notation: 
* [  ] means optional
* `abc` is a class or field name
* "xyz" is a value
* <abc> is a placeholder for value
* (object), (String), (Array) are JavaScript tpyes

## "GUI" API
### gui.init ( \[portalName\] \[,port\] \[,rootPath\])
Returns the main `page` object and starts a minimal REST/JSON
web service eco system for the portal.

Example code:

```javascript
var gui = require ( 'easy-web-app' )
var mainPage = gui.init ( )
...
```

The `portalName` appears on every page as `logoText`.
You are able to change that, or alternatively define an `logoURL` for an image. 

The `port` defines the TCP port for the Web Services. Default `port` is "8888".

`rootPath` is the location in the URL, e.g. `init( 'XY', 8080, '/myportal' )` 
will start result in the base URL `http://localhost:8080/myportal` 
(see [custom-css example](https://github.com/ma-ha/easy-web-app/blob/master/examples/custom-css/index.js)))

### gui.addPage ( pageId \[, title\] \[, viewDef\] \[, viewConfig\] )
Returns the new `page` object.

Header and footer will be included from the "main" `page`, 
but of course you can change this in the `page`.

Example code:
```javascript
...
gui.addPage( '2ndPage', '2nd Page' ) // will be empty
gui.addPage( 'XYZ/PageA', '3rd Page', { id:'a1', type:'pong-table', height:'500px' } ) 
gui.addPage( 'XYZ/PageB', '3rd Page', { id:'b1', type:'pong-table', height:'500px' } ) 
...
```

Remark: All pages are stored in the `gui.pages[]` array. 
By `gui.addPage(...)` also a navigation menu for page navigation 
will provided automatically. In the example "PageA" and "PageB" 
are in a "XYZ" navigation menu tab.

### gui.addPullDownMenu ( menuId, menuLabel ) 
Add a pull down menu. Pages can be assigned to this menu by labeling them
`menuID/mageId`.

### gui.addPullDownMenuHtmlItem( menuId, htmlString ) 
Add a line to the pull down menu with static HTML.


### gui.addView ( viewDef \[, moduleConfig\] \[, page\] ) 
Returns `view` object (part of the `page` object structure).

By default it will add a `view` in a new row to the "main" page.

The `viewDef` must at least define an `id` and should define `type` (check out the
[available view types](https://github.com/ma-ha/rest-web-ui/tree/master/html/modules#modulesviews)).

The `moduleConfig` holds the specific parameters for the `viewDef.type` plug-in.  

The `moduleConfig` can be `null`, if there is a `viewDef.resourceURL` given.
You are responsible to implement the REST/JSON web service for the `moduleConfig`.
The view "type" is appended to "ressourceURL (`<resourceURL>/<type>`), so if you 
have a resource like http://my.server/products/ you can define different views 
for that, e.g.  
* GET http://my.server/products/pong-form/
* GET http://my.server/products/pong-table/
* GET http://my.server/products/pong-help/

Example code:
```javascript
...
gui.addView( { id:'X' } ) // ads another empty view to the main page
...
```
### gui.addLang ( languageId [, translations] )
Adds a supported language. 

Translations can be added as an object with `label:translations`, e.g.
```javascript
// default language uses normal lables
gui.addLang( 'EN' ) 
// this language uses translations
gui.addLang( 'DE',
    { 
      'Title':'Title'
      ,'Language':'Sprache'
      ,'Main Page':'Hauptseite'
      , ...
    } 
  )
```

You may call `gui.addTranslation(...)` to add translations for labels one by one.

### gui.addTranslation ( languageId, label, translation )
Adds a translation for a single label to a supported language.
```javascript
gui.addLang( 'DE' ) 
gui.addTranslation( 'DE', 'Language', 'Sprache' ) 
gui.addTranslation( 'DE', 'Main Page', 'Hauptseite' )
``` 

### gui.enableSecurity( paramsObj )
Add [pong-security module](https://github.com/ma-ha/rest-web-ui/tree/master/html/modules/pong-security) to the header. 

`paramsObj` can be empty, but you can specify:
* `loginURL`: request login web service URL to POST the userid and password, default is `/login`
* `loginPage`: page id to show after a successful login, default is `main`   
* `logoutURL`: request logout web service URL (POST), default is `/logout` 
* `logoutPage`: page id to show after a successful logout, default is `main`
* `registgerURL`: if you need a link to a registration page id, default is `null` 

IMPORTANT: You need to implement 
* `gui.authenticate = function(user,password,callback){ ... callback(err,true/false) }` and 
* `gui.authorize = function(user,page){ ... return true/false}` function,
see [security example](https://github.com/ma-ha/easy-web-app/blob/master/examples/security/index.js). 

Optional you can implement a change password hook. 
```javascript
gui.changePassword =  
  function changePassword( user, oldPasswprd, newPassword, callback ) {
     ...
     callback( err, changedStatus )
  }
```
`changedStatus` should be _true_ if password was changed successfully.

If the hook is defined, the Web UI will generate a link and a modal form for you.

Remark:  In HA set up, you need also implement 
* `createToken( userId ){ ... return token }` 
* `getUserIdForToken( token ){ ... return userId }`
* `gui.deleteUserIdForToken(token)`
functions, typically using a distributed cache.

### gui.getExpress()
Returns the "express" web service plug-in, so that you can implement 
web services, e.g. for forms commits or loading i18n translations
(ref. examples with \*). 

## "Page" API Reference
Page object reference: 
[structure specification of rest-web-ui](https://github.com/ma-ha/rest-web-ui/wiki/Structure-Specification)

For page the following structure will be set up:
* `title` (String)
* `header` (object)
  * `logoText` (String)
  * `modules` (Array)
    * "nav-bar" object 
* `rows` (empty Array, use `page.addView(...)` or 
  `page.addColumnsRow(...)` to add elements	)
* `footer`
  * `copyrightText` (String) 
  * `modules` (empty Array)

### page.addView ( def \[, config\] )
Adds a new `row` with a new `view` and returns the `view`, ref. `gui.addView`.

Example code:
```javascript
...
var gui = require ( 'easy-web-app' )
var mainPage = gui.init ( )
mainPage.addView( 
	{ id:'42', type:'pong-mediawiki', resourceURL:'http://${lang}.wikipedia.org/w/' },
	{ page: { EN: "Main_Page",
	          DE: "Wikipedia:Hauptseite",
	          IT: "Pagina_principale" },
	  wikiRef: "/wiki/" }
	)
...
```

### page.addIoView ( def \[, config\] )
Returns IoView, ref. [I/O example](https://github.com/ma-ha/easy-web-app/tree/master/examples/io).

### page.setLogoText ( text )
Main page only!

See [customize example](https://github.com/ma-ha/easy-web-app/tree/master/examples/custom-css)

### page.setLogoURL ( url )
Main page only!

See [customize example](https://github.com/ma-ha/easy-web-app/tree/master/examples/custom-css)

### page.setPageWidth ( width )
Override CSS and set to `width` value: `px` or `%` are welcome.

See [customize example](https://github.com/ma-ha/easy-web-app/tree/master/examples/custom-css)


#### View reference
By default the view has
* `title` (String) 
  * set to `def.title` or `def.id` or "View: "
* `decor` (String)
  * set to `def.decor` or "decor"
* `resourceURL` (String)
  * set to `def.resourceURL` or "none" (TODO: check if it must be unset)
* \[`type`\] (String)
* \[`moduleConfig`\] (Object)
  * set to `config`, if that method parameter is defined
* \[`actions`\] (Array)
  * set to `def.actions`, if that attribute is defined

Details ref. [structure specification of rest-web-ui](https://github.com/ma-ha/rest-web-ui/wiki/Structure-Specification)

Example code:
```javascript
...
var myView = mainPage.addView( ... )
// create empty actions array, if not already there:
if ( ! myView.actions ) myView.actions = []
// add help button for view:
myView.actions.push( { type:"pong-help" } ) 
...
```

### addColumnsRow ( id, width )
Adds and returns a `row` object with `cols` array in it.

Example code, see ["complex-layout" example](https://github.com/ma-ha/easy-web-app/tree/master/examples/complex-layout)

## "Rows" API
Used inside a `page`.

### row.addView ( def \[, config\] )
Appends a row with new view and returns the view, see `gui.addView(...)`.

Example code, see ["complex-layout" example](https://github.com/ma-ha/easy-web-app/tree/master/examples/complex-layout)

### row.addColumnsRow ( id, height )
Adds and returns a `row` object with `cols` array in it.

Example code, see ["complex-layout" example](https://github.com/ma-ha/easy-web-app/tree/master/examples/complex-layout)

## "Columns" API
Used inside a `page`.

### column.addView ( def \[, config\] )
Appends a column with new view and returns the view, see `gui.addView(...)`.

Example code, see ["complex-layout" example](https://github.com/ma-ha/easy-web-app/tree/master/examples/complex-layout)

### column.addRowsColumn ( id, width )
Adds and return `rows` object.

Example code, see ["complex-layout" example](https://github.com/ma-ha/easy-web-app/tree/master/examples/complex-layout)
