# Examples
Perhaps start here:
* [Simple form explained -- showing all currently supported field types](https://github.com/ma-ha/easy-web-app/blob/master/examples/simple/)
  *  [Simple form JS source](https://github.com/ma-ha/easy-web-app/blob/master/examples/simple/index.js)
  
## View Type examples  
* [Simple form -- showing all currently supported field types](https://github.com/ma-ha/easy-web-app/blob/master/examples/simple/index.js)
* [Table demo](https://github.com/ma-ha/easy-web-app/blob/master/examples/table-demo/index.js) \*
* [Content via MediaWiki API](https://github.com/ma-ha/easy-web-app/blob/master/examples/wiki-demo/index.js)
* [I/O demo](https://github.com/ma-ha/easy-web-app/blob/master/examples/io/index.js) \*

## Other Features
* [2 pages with navigation](https://github.com/ma-ha/easy-web-app/blob/master/examples/multi-page/index.js)
* [menu demo](https://github.com/ma-ha/easy-web-app/blob/master/examples/menu-tabs/index.js)
* [i18n / internationalization / multi-language support](https://github.com/ma-ha/easy-web-app/blob/master/examples/i18n/index.js) \*
* ["complex" layout demo -- more than one view on a page](https://github.com/ma-ha/easy-web-app/blob/master/examples/complex-layout/index.js)
* [change view configuration "on-the-fly"](https://github.com/ma-ha/easy-web-app/blob/master/examples/on-the-fly-config/index.js)

<sub>_Remark: (\*) includes a REST/JSON web service implementation_</sub>  
 
 
# API Reference
## "GUI" API
### gui.init ( [portalName] [,port] )
Returns the main [page][page] object.

The `portalName` appears on every page as "logoText".
You may change that, e.g. define an "logoURL" for an image. 

The `port` default is 8888.

### gui.addPage ( pageId [, title] [, viewDef] [, viewConfig] )
Returns the new [page][page] object.

Header and footer will be included from the main page, 
but of course you can change this in the [page][page].

### gui.addView ( viewDef, moduleConfig [, page] ) 
Returns view object (part of the `page` object structure).

By default it will add a view in a new row to the "main" page.

The `viewDef` should at least define a `type` for the view.

The `moduleConfig` defines the plug-in (=`viewDef.type`) parameters.  

The `moduleConfig` can be `null`, if there is a `viewDef.resourceURL` given.
You are responsible to implement the REST/JSON web service for the `moduleConfig`.
The view "type" is appended to "ressourceURL (`<resourceURL>/<type>`), so if you 
have a resource like http://my.server/products/ you can define different views for that,
e.g.  
* GET http://my.server/products/pong-form/
* GET http://my.server/products/pong-table/
* GET http://my.server/products/pong-help/

## "Page" API Reference
Page object reference: 
[structure specification of rest-web-ui](https://github.com/ma-ha/rest-web-ui/wiki/)

_Remark: [...] means optional_

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
  
### page.addView ( def [, config] )
Adds a new `row` with a new `view` and returns the `view`, ref `gui.addView`.

#### View reference
By default the view has
* `title` (String) 
  * set to `def.title` or `def.id` or "View: "
* `decor` (String)
  * set to `def.decor` or "decor"
* `resourceURL` (String)
  * set to `def.resourceURL or "none" (TODO: check if it must be unset)
* \[`type`\] (String)
* \[`moduleConfig`\] (Object)
  * set to `config`, if that method parameter is defined
* \[`actions`\] (Array)
  * set to `def.actions`, if that attribute is defined

Details ref. [structure specification of rest-web-ui](https://github.com/ma-ha/rest-web-ui/wiki/)


### addColumnsRow ( id, width )
Adds and returns a `row` object with `cols` array in it

## "Rows" API
Used inside a `page`.

### row.addView ( def [, config] )
Appends a row with new view and returns the view, see `gui.addView(...)`

### row.addColumnsRow ( id, height )
Adds and returns a `row` object with `cols` array in it

## "Columns" API
Used inside a `page`.

### row.addView ( def [, config] )
Appends a column with new view and returns the view, see `gui.addView(...)`

### addRowsColumn ( id, width )
Adds and return `rows` object
