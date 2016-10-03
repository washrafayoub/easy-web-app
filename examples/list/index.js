var gui     = require( '../../' )     // stand alone: replace with  require( 'easy-web-app' ) 
var express = require( 'express' )
var log = require('npmlog');

log.info( __dirname )

// define to load /css-custom/custom.css from local folder
gui.getExpress().use( '/css-custom', express.static( __dirname ) )
gui.getExpress().use( '/img-cust', express.static( __dirname + '/img-cust' ) )
  

// define a main page
var mainPage = gui.init( 'List Demo', 8880 )
mainPage.setTitle( 'List Demo' )
mainPage.setPageWidth( '90%' )
  
mainPage.addView( 
    { 
      id:'row1view', 
      title:'Service Dashboard',
      height:'700px', 
      type:'pong-list',
      resourceURL:'/service/statistics'
    },
    {
      maxRows:'4',
      rowId: 'ID',
      divs: [
          { id:'ID', cellType:'text' }, 
          { id:'XCust', cellType:'div',
            'divs': [
              { id:'CustomerCountLb', cellType:'label', label:'Customers:' },
              { id:'CustomerCount', cellType:'text' }
            ]
          },  
          { id:'XSize', cellType:'div',
            'divs': [
               { id:'Sizelb', cellType:'label', label:'Sizing:' },
               { id:'Slb', cellType:'label', label:'S:' },
               { id:'Size.S', cellType:'text' },
               { id:'Size.Strend', cellType: 'icon' }, 
               { id:'Mlb', cellType:'label', label:'M:' },
               { id:'Size.M', cellType:'text' },
               { id:'Size.Mtrend', cellType: 'icon' }, 
               { id:'Llb', cellType:'label', label:'L:' },
               { id:'Size.L', cellType:'text' },
               { id:'Size.Ltrend', cellType: 'icon' }
            ]
          },  
          { id:'XOrders', cellType:'div',
            'divs': [
               { id:'Orderslb', cellType:'label', label:'Orders' },
               { id:'Orders.D', cellType:'text' },
               { id:'OrdersDlb', cellType:'label', label:'last day' },
               { id:'Orders.Dtrend', cellType: 'icon' }, 
               { id:'Orders.W', cellType:'text' },
               { id:'OrdersWlb', cellType:'label', label:'last week' },
               { id:'Orders.Wtrend', cellType: 'icon' }, 
               { id:'Orders.M', cellType:'text' },
               { id:'OrdersMlb', cellType:'label', label:'last month' },
               { id:'Orders.Mtrend', cellType: 'icon' }
            ]
          },  
          { id:'XRating', cellType:'div',
            'divs': [
               { id:'RatingLb', cellType:'label', label:'Customer Rating' },
               { id:'Rating', cellType:'rating', ratingType:'3star' }
            ]
          },  
          { id:'XAvail', cellType:'div',
            'divs': [
               { id:'AvailabilityLb', cellType:'label', label:'Availability' },
               { id:'Availability', cellType:'text' }
            ]
          } 
       ]
    }
)

var svc  = gui.getExpress();
svc.get( 
  '/service/statistics', 
  function( req, res ) {
    // generate some dummy data:
    var tableData = 
      [ 
       {"ID":"ABC","CustomerCount":"1234","Rating":"3","Status":"false","Size":{"S":"40%","Strend":"arrow-1-e","M":"30%","Mtrend":"arrow-1-e","L":"30%","Ltrend":"arrow-1-ne"},"Orders":{"D":"4","W":"11","M":"123","Dtrend":"arrow-1-n","Wtrend":"arrow-1-e","Mtrend":"arrow-1-se"},"Availability":"<span style=\"color:green\">100%</span>"},
       {"ID":"XYZ","CustomerCount":"345","Rating":"2","Status":"true","Size":{"S":"40%","Strend":"arrow-1-e","M":"30%","Mtrend":"arrow-1-se","L":"30%","Ltrend":"arrow-1-ne"},"Orders":{"D":"4","W":"11","M":"123","Dtrend":"arrow-1-ne","Wtrend":"arrow-1-e","Mtrend":"arrow-1-se"},"Availability":"<span style=\"color:orange\">99,96%</span>"},
       {"ID":"A123","CustomerCount":"678","Rating":"2","Status":"true","Size":{"S":"40%","Strend":"arrow-1-se","M":"30%","Mtrend":"arrow-1-n","L":"30%","Ltrend":"arrow-1-e"},"Orders":{"D":"4","W":"11","M":"123","Dtrend":"arrow-1-s","Wtrend":"arrow-1-e","Mtrend":"arrow-1-se"},"Availability":"<span style=\"color:green\">100%</span>"},
       {"ID":"YIII","CustomerCount":"900","Rating":"2","Status":"true","Size":{"S":"40%","Strend":"arrow-1-e","M":"30%","Mtrend":"arrow-1-n","L":"30%","Ltrend":"arrow-1-se"},"Orders":{"D":"4","W":"11","M":"123","Dtrend":"arrow-1-ne","Wtrend":"arrow-1-e","Mtrend":"arrow-1-se"},"Availability":"<span style=\"color:red\">88,5%</span>"}
      ]
    res.json( tableData )
  }
)
