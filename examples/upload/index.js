var gui = require ( '../../' )       // stand alone: replace with  require( 'easy-web-app' )
var fileupload = require("express-fileupload")

// initialize the web app framework and a default main page
var page = gui.init ()
page.header.logoText = 'Upload Files Example'

// add upload module
gui.addView ( 
  {
    id    : 'Upload',
    title : 'Upload',
    type  : 'pong-upload',
    resourceURL : '/upload',
    height: '100px'
  },
  {
    update: [ 'Files' ]
  }
)

// file list
gui.addView ( 
  {
    id    : 'Files',
    title : 'File List',
    type  : 'pong-table',
    resourceURL : 'files',
    height: '500px'
  },
  {
    dataURL: '',
    rowId: 'ID', // required for editable cells and select
    cols: [
      {
        width: "30%",
        id: 'filename',
        label: 'filename',
        cellType: "text"
      },
      {
        width: "20%",
        id: 'mimeType',
        label: 'mimeType',
        cellType: "text"
      },
      {
        width: "20%",
        id: 'size',
        label: 'size',
        cellType: "text"
      },
      {
        width: "20%",
        id: 'date',
        label: 'date',
        cellType: "datems"
      }
    ]
  }
)


// API:
var svc  = gui.getExpress()
let fileList = []

svc.get( '/files', ( req, res ) => {
  res.json( fileList )
})

svc.use(fileupload())

svc.post( '/upload', (req, res) => {
    if ( ! req.files ) { 
      console.log( 'File not foud' )
      return res.send("File was not found")
    }
    console.log( req.files )
    fileList.push({
      filename : req.files.file.name,
      mimeType : req.files.file.mimetype,
      size     : req.files.file.size,
      date     : Date.now()
    })    
    res.send("File Uploaded")
})
