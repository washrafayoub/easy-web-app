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
 
 
# GUI API Reference
## gui.init ( [portalName] [,port] )
Returns the main [page][page] object.

The `portalName` appears on every page as "logoText".
You may change that, e.g. define an "logoURL" for an image. 

The `port` default is 8888.

## gui.addPage ( pageId [, title] [, viewDef] [, viewConfig] )
Returns the new [page][page] object.

Header and footer will be included from the main page, 
but of course you can change this in the [page][page].

## gui.addView ( viewDef, moduleConfig [, page] ) 
Returns view object (part of the [page][page] object structure).

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

# [page]: Page API Reference
Page object reference: 
(structure specification of rest-web-ui)[https://github.com/ma-ha/rest-web-ui/wiki/]

## page.addView ( def, config )
adds a new row with a new view, ref gui.addView

## addColumnsRow ( id, width )
Adds and returns a `row` object with `cols` array in it

ref `Rows API`

# [row]: Rows API

## row.addView ( def, config )
append a row with new view, see gui.addView(...)

## row.addColumnsRow ( id, height )
adds and returns a `row` object with `cols` array in it

# Columns API
## row.addView ( def, config )
append a column with new new, see gui.addView(...)

## addRowsColumn ( id, width )
adds and return `rows` object
