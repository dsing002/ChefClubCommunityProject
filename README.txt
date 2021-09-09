                                                         !!!CHEF CLUB COMMUNITY!!!

Welcome to my recipe web application 'myapp' or as i have named it chef club community, i have been working on creating a fully functional web application that
has successfully implement nearly all of the requirements with only one being partially met, that being the search page, where it is connected to the database but
is unable to only display just the keyword result, it displays everything in the database instead. However, over the course of creating this application i have 
learnt many new techniques and inventive ways to both create a functional web application but also a aestheically pleasing one. Below is the checklist and what i
have completed, as well as where each requirement can be found. and velow that will be further explanation of my database design as well as my ER diagram which 
can be found as a jpg image in the README folder.

/////////////////////////////////////////////////////////////////////////////////   
 **SEE PDF FOUND IN THE README FOLDER FOR THE ER DIAGRAM AND DETAILS ABOUT IT**
//////////////////////////////////////////////////////////////////////////////// 


//////////////////////////////////////////////////////////
  **Detailed criteria for your app (requirements list)**
//////////////////////////////////////////////////////////

1) It is a Node.js
   -completed
   
2) There is a home page with links to all other pages
   -completed, found at views/index.html and main.js line 50.
   
3) There is a register page
   -completed, found at views/register.html and main.js line 95.
   
4) There is user authentication page (i.e. logins)
   -completed, found at views/login.ejs and main.js line 137.
   
5) There is an add recipe page (available only to logged in users) for each recipe store at least three items: name of the recipe, text of the recipe and the name of the user who created/added the recipe.
   -completed, found at views/addrecipe.html and main.js line 212.
   
6) There is an update recipe page (available only to logged in users)
   -completed, found at views/updaterecipe.html and main.js line 283.
   
7) There is a delete recipe page (available only to logged in users)
   -completed, found at views/deleterecipe.html and main.js line 243.
   
8) There is a list page, listing all recipes and the name of the user who added the recipe 
   -completed, found at views/list.html and main.js line 191.
   
9) The forms have some validations
   -completed, found at main.js line 95.
   
10) There are useful feedback messages to the user
    -completed, found at main.js under all routes where there is a res.send and views/logout.html.
    
11) It has a database backend that implements CRUD operations (the database can be MySQL or Mongodb)
    -completed, found at views/addrecipe.html, list.html, updaterecipe.html and deleterecipe.html.
    
12) The create & update operations take input data from a form or forms (available only to logged in users)
    -completed, found at views/updaterecipe.html and addrecipe.html and main.js line 212 and 283.
    
13) The login process uses sessions
    -completed, found at main.js line 161.
    
14) Passwords should be stored as hashed
    -completed, found at main.js line 112.
    
15) There is a way to logout
    -completed, found at views/logout.html and main.js line 181.
    
16) There is a basic api i.e. recipes content can be accessed as json via http method, It should be clear how to access the api (this could include comments in code)
    -completed, found at main.js line 384.
    
17) There are links on all pages to home page providing easy navigation for users
    -completed, found on all html and ejs pages at the bottom as well as all res.send messages in main.js.
 
 
The key areas that i have put in a lot of work are the add, update and delete recipe pages as well as the list pages where i have added images and and extensive
styling to make it look as good as possible!


/////////////////////////////////////////////
 **Detailed criteria for your gitlab repo:**
/////////////////////////////////////////////

1) The name of the project on gitlab must be "myapp"
   -completed.
   
2) There is a readme file in the root of your gitlab repo including information listed below
   -completed, found in the README folder wiht the README.txt and ER diagram.
   
3) There are comments inserted in the code, separating different parts of the code with brief explanation of the functionality of the code
   -completed.
    
/////////////////////////////////////////////////////////////////////////////////   
 **SEE PDF FOUND IN THE README FOLDER FOR THE ER DIAGRAM AND DETAILS ABOUT IT**
////////////////////////////////////////////////////////////////////////////////    