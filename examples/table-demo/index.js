/** Simple example: Create a web page with form */

var gui = require ( '../../' )       // stand alone: replace with  require( 'easy-web-app' )
var bodyParser  = require( 'body-parser' )

// initialize the web app framework and a default main page
gui.init ()

// add a view of type 'pong-easy-table' (= plug-in) 
gui.addView ( 
  // view config
  {
    'id'   : 'tableView',
    'title':'Table Demo (sorry, zoom is always a flower ;-)',
    'type':'pong-easytable',
    'resourceURL':'/products',
    'actions':
      [
        {
           'type':'pong-help', 
           'modalName':'Show how easy it is to configure of this view',
           'param': { 'showConfig':'tableView' }
        }  
      ]
  },
  // view's "pong-easytable" plug-in config
  {
    dataURL:'',
    easyCols:
      [
        '*ID|5%',
        'Name=Name.0',
        'ProductPage_linkForCol_1',
        'Picture',
        'ZoomImg_zooms_Picture',
        'Status_checkbox',
        'Rating',
        'Description_editable',
        'Product~Page_link',
        'Created_datems_editable'
      ]
  }
)

// the table requires a REST web service to serve the data: 
var tableData = 
  [ 
    {"ID":"yyy1","Name":["Prod A","A"],"Rating":"3","Created":(new Date('2016/10/1').valueOf()),"Status":"false","ProductPage":"http:\/\/mh-svr.de\/pong_dev\/README.md","descr":"Blah blub bubber.","Picture":"img\/x02.png","ZoomImg":"img\/tst.jpg"},
    {"ID":"yyy3","Name":["Prod B","A"],"Rating":"2","Created":(new Date('2016/12/1').valueOf()),"Status":"true","ProductPage":"http:\/\/mh-svr.de\/pong_dev\/README.md","descr":"Blah blub bubber.","Picture":"img\/x03.png","ZoomImg":"img\/tst.jpg"},
    {"ID":"yyy4","Name":["Prod C","A"],"Rating":"2","Created":(new Date('2016/11/1').valueOf()),"Status":"true","ProductPage":"http:\/\/mh-svr.de\/pong_dev\/README.md","descr":"Blah blub bubber.","Picture":"img\/x04.png","ZoomImg":"img\/tst.jpg"},
    {"ID":"yyy5","Name":["Prod D","A"],"Rating":"2","Created":(new Date('2016/1/1').valueOf()),"Status":"true","ProductPage":"http:\/\/mh-svr.de\/pong_dev\/README.md","descr":"Blah blub bubber.","Picture":"img\/x05.png","ZoomImg":"img\/tst.jpg"},
    {"ID":"yyy6","Name":["Prod E","A"],"Rating":"1","Created":(new Date('2016/2/1').valueOf()),"Status":"false","ProductPage":"http:\/\/mh-svr.de\/pong_dev\/README.md","descr":"Blah blub bubber.","Picture":"img\/x06.png","ZoomImg":"img\/tst.jpg"},
    {"ID":"yyy7","Name":["Prod F","A"],"Rating":"2","Created":(new Date('2016/7/1').valueOf()),"Status":"false","ProductPage":"http:\/\/mh-svr.de\/pong_dev\/README.md","descr":"Blah blub bubber.","Picture":"img\/x07.png","ZoomImg":"img\/tst.jpg"},
    {"ID":"yyy8","Name":["Prod G","A"],"Rating":"2","Created":(new Date('2016/6/1').valueOf()),"Status":"true","ProductPage":"http:\/\/mh-svr.de\/pong_dev\/README.md","descr":"Blah blub bubber.","Picture":"img\/x08.png","ZoomImg":"img\/tst.jpg"},
    {"ID":"yy09","Name":["Prod I","A"],"Rating":"3","Created":(new Date('2016/5/1').valueOf()),"Status":"true","ProductPage":"http:\/\/mh-svr.de\/pong_dev\/README.md","descr":"Blah blub bubber.","Picture":"img\/x10.png","ZoomImg":"img\/tst.jpg"},
    {"ID":"yy19","Name":["Prod J","A"],"Rating":"3","Created":(new Date('2016/4/1').valueOf()),"Status":"true","ProductPage":"http:\/\/mh-svr.de\/pong_dev\/README.md","descr":"Blah blub bubber.","Picture":"img\/x11.png","ZoomImg":"img\/tst.jpg"},
    {"ID":"yy11","Name":["Prod K","A"],"Rating":"2","Created":(new Date('2016/3/1').valueOf()),"Status":"true","ProductPage":"http:\/\/mh-svr.de\/pong_dev\/README.md","descr":"Blah blub bubber.","Picture":"img\/x12.png","ZoomImg":"img\/tst.jpg"},
    {"ID":"yy12","Name":["Prod L","A"],"Rating":"2","Created":(new Date('2016/8/1').valueOf()),"Status":"true","ProductPage":"http:\/\/mh-svr.de\/pong_dev\/README.md","descr":"Blah blub bubber.","Picture":"img\/x13.png","ZoomImg":"img\/tst.jpg"},
    {"ID":"yy13","Name":["Prod M","A"],"Rating":"2","Created":(new Date('2016/9/1').valueOf()),"Status":"true","ProductPage":"http:\/\/mh-svr.de\/pong_dev\/README.md","descr":"Blah blub bubber.","Picture":"img\/x14.png","ZoomImg":"img\/tst.jpg"},
    {"ID":"yy14","Name":["Prod N","A"],"Rating":"2","Created":(new Date('2016/12/6').valueOf()),"Status":"true","ProductPage":"http:\/\/mh-svr.de\/pong_dev\/README.md","descr":"Blah blub bubber.","Picture":"img\/x15.png","ZoomImg":"img\/tst.jpg"}
  ]

var svc  = gui.getExpress();
svc.get( 
  '/products', 
  function( req, res ) {
    // generate some dummy data:
    res.json( tableData )
  }
)

svc.post( 
  '/products',
  bodyParser.urlencoded( { extended: false } ),  
  function( req, res ) {
    if ( req.body && req.body.ID && req.body.Created )  {
      for ( var i = 0; i < tableData.length; i++ ) {
        if ( tableData[i].ID == req.body.ID ) {
          tableData[i].Created = req.body.Created
          console.log( 'Changed: "Created"='+req.body.Created+' for ID='+req.body.ID )
          continue
        }
      }
    }
    res.json( tableData )
  }
)
