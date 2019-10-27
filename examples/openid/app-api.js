const log      = require( 'npmlog' )
// const jwt      = require( 'express-jwt' )
const jwks     = require( 'jwks-rsa' )
const jwtAuthz = require( 'express-jwt-authz' )
const cfg      = require( 'config' )
const jwtParser = require( 'jsonwebtoken' )

exports: module.exports = { 
  setupAPI : setupAPI 
}

// ============================================================================
// API:
// now we need to implement the ReST service for /products 
// this should also only be available for authenticated users

function setupAPI( app ) {
  let svc  = app.getExpress()

  // // this should be better solution - but not working!
  // var jwtCheck = jwt({
  //   secret: jwks.expressJwtSecret({
  //     cache: true,
  //     rateLimit: true,
  //     jwksRequestsPerMinute: 5,
  //     jwksUri: cfg.JWKS_URI
  //   }),
  //   clientID  : cfg.CLIENT_ID,
  //   audience  : cfg.AUDIENCE,
  //   issuer    : cfg.ISSUER,
  //   algorithms: ['RS256']
  // })
  // const checkScopes = jwtAuthz([ cfg.AUTH_SCOPE ])
  // svc.get( '/products', jwtCheck, // checkScopes,

  const myJWTcheck = initJWTcheck()

  svc.get( '/products', myJWTcheck, 
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

// ----------------------------------------------------------------------------
// Authorization Checker

function initJWTcheck() {
  let clientID = cfg.CLIENT_ID
  let audience = cfg.AUDIENCE
  let issuer   = cfg.ISSUER

  let check = (req, res, next) => {
    console.log( 'check called' )
    // parse JWT
    let parts = req.headers.authorization.split( ' ' )
    if ( parts.length == 2  &&  parts[0] == 'Bearer' ) {
      let tokenStr = parts[1]
      let token = jwtParser.decode( tokenStr, { complete: true }) || {}
      // console.log( token.payload )
      if ( token.payload && token.payload.name && token.payload.aud&& token.payload.iss ) {
        // let userId = token.payload.name
        // console.log( 'JWT: user = '+ userId )

        // check audience
        if ( token.payload.aud != clientID ) {
          return next( new UnauthorizedError(
            'JWT audience incorrect', 
            { message: 'JWT audience (payload.aud) is not Client ID' }
          ))
        }

        // check issuer
        if ( token.payload.iss != issuer ) {
          return next( new UnauthorizedError(
            'JWT audience issuer', 
            { message: 'JWT issuer (payload.iss) is not '+issuer }
          ))
        }
      } else {
        return next( new UnauthorizedError(
          'Bearer token contains no JWT user name', 
          { message: 'JWT requries payload.name' }
        ))
      }
    } else {
      return next( new UnauthorizedError(
        'No Bearer token found', 
        { message: 'Format is Authorization: Bearer [token]' }
      ))
    }
    // OK, check passed
    return next();
  }
  return check
}

function UnauthorizedError (code, error) {
  this.name    = "UnauthorizedError"
  this.message = error.message
  Error.call( this, error.message )
  Error.captureStackTrace( this, this.constructor )
  this.code   = code
  this.status = 401
  this.inner  = error
}

UnauthorizedError.prototype = Object.create(Error.prototype);
UnauthorizedError.prototype.constructor = UnauthorizedError;
