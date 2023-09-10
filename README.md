# Source code of [findagravemiddleboro.rf.gd](http://findagravemiddleboro.rf.gd)
Tool to search database of graves in Middleborough, MA. Made for Friends of Middleborough Cemeteries.

# Stack

MaterialUI
React
PHP
MySQL

# Features

Multiple values for a single field of an entry, made possible by a database with join tables.
Searching using various operators
Development site
Administrator editing
Automated pushing from main to server via FTP-Deploy-Action
SSL/TLS
Cloudflare
Indexed on Google
Brute force login attempt protection through timeouts


# Design 

There are two active paths, / and /edit. They both map to the same <App /> component, which is initialized with information about the fields from the same json file used to help convert the input xlsx to sql. However, when the edit path is accessed, there is an "edit" parameter which is passed to the App component as well, which renders all the data as links, which take you to a page where you can modify the data and then if the password you input along with it is correct, make changes to the database. Accessing the data is done through an asynchronous function which accesses the /getData.php endpoint with get paramaters of which fields.  


#Directory structure
The src folder contains the react which is compiled. AppWrapper.js is the highest level component, and handles getting field data and translating the path to a prop. The App component handles most of the logic of the main page of the website, which, in hindsight, is bad design practice and it should be split up into multiple files.  The public folder contains certain accessory files, like Google Search Verification, as well as files necessary to properly direct traffic and render the React. The api folder contains endpoints and the page displayed when you attempt to edit the site. The data folder contains utility scripts to parse the Excel data and turn it into SQL.
