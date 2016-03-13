# Complex Page Layout Example
Layout principle is to nest rows in columns and columns in rows.

Result layout:

	  ----------------------------
	  |  Row 1 View              |
	  ----------------------------
	  |  Row 2 View              |
	  ----------------------------
	  |  Row 3 with 2 columns    |
	  | ---------  ------------- |
	  | |       |  |   Col 2   | |
	  | | Col 1 |  | --------- | |
	  | | View  |  | | Row X | | |
	  | |       |  | --------- | |
	  | |       |  | | Row X | | |
	  | |       |  | --------- | |
	  | ---------  ------------- |
	  ----------------------------
	  |  Row 4 View              |
	  ----------------------------
 
# Run example
1. You need to [get a local copy of the easy-web gui](https://github.com/ma-ha/easy-web-gui).
2. in this directory simply run: `nodejs index.js` 