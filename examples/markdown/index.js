var gui = require ( '../../' )       // stand alone: replace with  require( 'easy-web-app' )

// initialize the web app framework and a default main page
var page = gui.init ()
page.header.logoText = 'Markdwon WIKI'

// add a view of type 'pong-easy-table' (= plug-in) 
gui.addView ( 
  {
    id    : 'MdQiki',
    title : 'Documentation',
    type  : 'pong-markdown',
    resourceURL : 'md/',
    height: '600px'

  },
  {
    page  : '${lang}/${page}',
    start : 'main.md',
    edit  : true
  }
)

// the table requires a REST web service to serve the data: 
var svc  = gui.getExpress()
var bodyParser = require( 'body-parser' )
var jsonParser = bodyParser.json()
var urlParser = bodyParser.urlencoded({ extended: false })

// API:

let mainMd = "# Title\nLorem ipsum dolor sit amet\n [[second.md]]"
let secondMd = "# Page2\nblabla bla blabl abla\n [[main.md]]"

svc.get( '/md/:lang/:page', ( req, res ) => {
  if ( req.params.page == 'main.md' ) {
    res.send( mainMd )
  } else if ( req.params.page == 'second.md' ) {
    res.send( secondMd )
  } else {
    res.send( mainMd )
  }
})

svc.post( '/md/:lang/:page', urlParser, ( req, res ) => {
  if ( req.body.markdown ) {
    if ( req.params.page == 'main.md' ) {
      mainMd = req.body.markdown 
    } else if ( req.params.page == 'second.md' ) {
      secondMd = req.body.markdown 
    } 
    res.send( 'Saved' ) 
  } else {
    res.send( 'ERROR' ) 
  }
})
