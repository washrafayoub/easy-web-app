# Mobile Detect Example
The rest-web-gui framework is able to detect the browser. 
If a mobile phone or a tablet is detected it will try to load a specialized layout.
The layout is identified by a naming convention, by adding a `-t` or `-m`.

This example will provide a `main` and a `other` page. 
For tablets also a `main-t` and a `other-t` layout, 
for mobile phones a `main-m` and a `other-m` layout is provided.

The navigation tabs will only show the layouts without `-t` and `-m`. 

 
# Run example
1. You need to [get a local copy of the easy-web gui](https://github.com/ma-ha/easy-web-gui).
2. in this directory simply run: `nodejs index.js` 