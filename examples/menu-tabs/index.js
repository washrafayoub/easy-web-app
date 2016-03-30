/** Simple example: Create a web page with form */

var gui = require ( '../../' )
// stand alone: relpace with  require( 'easy-web-app' )

// initialize the web app framework and a default main page
var mainPage = gui.init ( 'Menu Demo' )
mainPage.title = 'Page ABC' // replace default = "main"
mainPage.addView ( { id : 'Page abc' }, null )

/** Add a 2nd page page. */
var page2 = gui.addPage( 'secondpage', 'Page XYZ',  { id:'Page xyz' }, null )

/** Add a 3rd page page. */
// The page name is an URL and you can define a sub-menu like  
// this "myMenu" as name. If you need a non URL conform name 
// (e.g. "My Menu" with spaces etc.) you can use the i18n 
// feature to map technical labels in any language. 
var page3 = gui.addPage( 'myMenu/foo', 'Sub Page 1', { id:'Page 1' } )

/** Add a 4th page page. */
var page4 = gui.addPage( 'myMenu/bar', 'Sub Page 2',{ id:'Page 2' }, null )


// now add a stand alone pull down menu:
var pullDownMenu = 
  { id: 'PullDownMenu', type: 'pong-pulldown', 
    moduleConfig: {
      title: 'Test',
      menuItems : [
         { html:'<b>Some more menu tests:</b>' },
         { pageLink:'myMenu/foo', label:'Page 1 again' },
         { pageLink:'myMenu/bar', label:'Page 2 again' },
         { html:'<hr/>' },
         { html:'<span class="ui-icon ui-icon-extlink tbl-link-icon" '+
           'style="display: inline-block; vertical-align: bottom;"></span>'+
           '<a href="https://www.npmjs.com/package/easy-web-app" '+
           'target="_blank">npm package</a>' } // wow -- demo quick hack :-#
      ]   
    } 
  }

mainPage.header.modules.push( pullDownMenu )