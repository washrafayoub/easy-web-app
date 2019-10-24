const log      = require( 'npmlog' )
const jwt      = require( 'express-jwt' )
const jwks     = require( 'jwks-rsa' )
const jwtAuthz = require( 'express-jwt-authz' )
const cfg      = require( 'config' )

exports: module.exports = { 
  setupAPI : setupAPI 
}

// ============================================================================
// API:
// now we need to implement the ReST service for /products 
// this should also only be available for authenticated users

function setupAPI( app ) {
  let svc  = app.getExpress()

  var jwtCheck = jwt({
    secret: jwks.expressJwtSecret({
      cache: true,
      rateLimit: true,
      jwksRequestsPerMinute: 5,
      jwksUri: cfg.JWKS_URI
    }),
    clientID  : cfg.CLIENT_ID,
    audience  : cfg.AUDIENCE,
    issuer    : cfg.ISSUER,
    algorithms: ['RS256']
  })

  const checkScopes = jwtAuthz([ cfg.AUTH_SCOPE ])

  // svc.use( jwtCheck ) // use it globally (not recommendet)

  svc.get( '/products', jwtCheck, // checkScopes,
    async function( req, res ) {
      try {
        if ( await app.getUserIdFromReq( req ) ) {
          if ( ! app.checkUserCSRFtoken( req ) ) {
            log.warn( 'GET products', 'CSRF wrong!!')
          }
          log.info( 'products service', 'user is logged in' )
          // generate some dummy data:
          let tableData = 
            [ 
            {"Name":"Product AB","Rating":"3"},
            {"Name":"Product 1","Rating":"2"},
            {"Name":"XYZ Product","Rating":"1"},
            {"Name":"My Product","Rating":"1"},
            {"Name":"Secret Product 1","Rating":"2"},
            {"Name":"Top Secret Product 2","Rating":"0"},
            {"Name":"Product XYZ","Rating":"0"},
            {"Name":"My Prod","Rating":"0"},
            {"Name":"Your Prod","Rating":"3"},
            {"Name":"Other Product","Rating":"1"},
            {"Name":"Just a Product","Rating":"2"}
            ]
          res.status( 200 ).json( tableData )  		
        } else {
          log.info( 'products service', 'not allowed for unauthenticated users' )
          res.status( 401 ).send( "You must login first!!"  )  		  		
        }
      } catch ( exc ) { 
        log.error('products service', exc )
        res.status( 500 ).send('Oups')
      }
    }
  )
}