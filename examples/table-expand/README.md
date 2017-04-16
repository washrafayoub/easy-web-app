## Table Expand Demo

Table supports expand with custom DIVs to show JSON tree-data, 

[JS code](https://github.com/ma-ha/easy-web-app/blob/master/examples/table-expand/index.js):

```javascript
var gui = require( 'easy-web-app' )
// initialize the web app framework 
var mainPage = gui.init( 'Table Expand Demo' )
mainPage.title = 'Table Expand Demo'
mainPage.header.logoText = 'Table Expand Demo'

gui.addView( // view config
  {
    'id': 'tableView',
    'title': 'Demo',
    'type': 'pong-table',
    'resourceURL': '/products'
  },
  // view's 'pong-table' plug-in config
  {
    dataURL: '',
    "cols": [
      {
        "cellType": "button", 
        "method": "expand",
        "id": "btExp", "width": "5%", "label": "&nbsp;",
        "expand": {
          // this are the elements of the exand:
          "divs": [ 
            { "id": "ID", "cellType": "text" },
            { "id": "Picture", "label": "Picture", "cellType": "img" },
            {
              "id": "XCust", "cellType": "div",
              "divs": [
                { "id": "CustomerCountLb", "cellType": "label", "label": "Customers" },
                { "id": "CustomerCount", "cellType": "text" },
                { "id": "RatingLb", "cellType": "label", "label": "Rating" },
                { "id": "Rating", "cellType": "rating", "ratingType": "3star" }
              ]
            },
            { "id": "descr", "label": "Description", "cellType": "text" }
          ]

        } 
      },
      // other "normal" table columns ...
      {  "id": "name", "label": "Name", "cellType": "text" },
      { ... },
      ...
    ]
  }
)

```
![table expand screen shot](https://raw.githubusercontent.com/ma-ha/easy-web-app/master/examples/table-expand/table-expand.png) 
