# Algorithmic Flow
## IMPACT_WebApp

(C) Copyright: Benten Technologies, Inc.

***

### Package Imports
> Lines 36-49
* **os** (For making os calls)
* **time** (For date, time computations)
* **yaml** (For loading secret files and keys)
* **pytz** (For timezones)
* **boto3** (AWS-SDK for python)
* **pymysql** (For MySQL connection in python)
* **flask** (Micro-Web-Framework: For routing, rendering templates, website and APIs)
* **pandas** (For creating/reading dataframes)
* **base64** (For base64 encoding and decoding objects)
* **datetime** (For datetime computations)
* **mktime** (To create time format from timestamp)
* **Crypto** (For cipher related security (AES) - Tokens for APIs)
* **datetime** (For datetime computations)
* **werkzeug.utils** (For fetching filename from uploads)

### Initializations
> Lines 53-72
* **BUCKET_NAME** (This is our AWS Storage Bucket Name)
* **key_db** (A dictionary where our Database credentials are loaded into for connection purposes)
* **Dynamo_DB** (Connecting to our DynamoDB on AWS using AWS_Access_Key and Secret_Key)
* **table_userData** (The DynamoDB table to which we will post some results)
* **app** (Starts the Flask App with an App-name)
* **app.config.from_mapping(SECRET_KEY='dev')** (Setting some secret for our WebApp)
* **app.secret_key** (Providing a secret key for WebApp to Load and Start)
* **option_val** (To store some option; Initially Empty)
* **fname** (To store some filename; Initially Empty)
* **face_fname** (To store some filename; Initially Empty)
* **patient_ID** (To store a patient_ID; Initially Empty)
* **user** (To variable that keeps a user in session; Initially Empty)

### Routing & Functions
> **1. Route ['/'](http://3.213.134.99:5000/) Default**
* Hits the IP address where the server (container) is running
* Will take you to 'Login' HTML script by default

> **2. Route ['/Login'](http://3.213.134.99:5000/Login) ['GET', 'POST']**
* This is the first page you will land into on hitting the server's IP
#### Login
`Function parameters: { }`
* Bring in the 'user' variable declared globally for session control
* Pop out the 'user' from the session if any for setting new session
* IF the request method is 'POST'
  * Get the user-email from the WebApp HTML form
  * Get the user-password from the WebApp HTML form
  * Call a function to establish connection with the WebApp MySQL Database to validate user credentials
  * Get the cursor from the connection (Used for reading and writing to the database)
  * Execute a query which locates the existence of the database and table 'impact_users' inside the database
  * IF we do not find / locate this 'impact_users' table (which will not happen but just for backup)
    * Create a new table with name 'impact_users' and create the fields for that table
    * Execute the create table query
    * Commit the query
    * Close the cursor
  * Open a new cursor
  * Run a query to validate the user based on entered 'email' and 'password'
  * IF the user is in the database
    * Set the session for the authenticated / validated user
    * Close the cursor
    * Get the user's id from 'email'
    * Flash a message on 'HomePage' with 'Login Success'
    * Render the landing page 'HomePage' HTML script and send the 'user' variable to HTML script
  * ELSE IF the user is not in the database
    * Close the cursor
    * Flash a message on 'Login' HTML script with 'Login Failed'
    * Render the same 'Login' HTML script again; Do not let user go ahead without authentication
* ELSE IF the method is not 'POST'
  * Render the same 'Login' HTML script again

> **3. Route ['/Register'](http://3.213.134.99:5000/Register) ['GET', 'POST']**
* Registration Page if a new user wants to register for our service
#### Register
`Function parameters: { }`
* Pop out the 'user' from the session if any for setting new session
* IF the request method is 'POST'
  * Get the user-name from the WebApp HTML form
  * Get the user-email from the WebApp HTML form
  * Get the user-password from the WebApp HTML form
  * Call a function to establish connection with the WebApp MySQL Database to validate user credentials
    * Get the cursor from the connection (Used for reading and writing to the database)
    * Execute a query which locates the existence of the database and table 'impact_users' inside the database
    * IF we do not find / locate this 'impact_users' table (which will not happen but just for backup)
      * Create a new table with name 'impact_users' and create the fields for that table
      * Execute the create table query
      * Commit the query
      * Close the cursor
    * Open a new cursor
    * Run a query to insert the user into the database with credentials provided
    * Commit the query
    * Close the cursor
    * Render the 'Login' HTML script for the user to Login
  * ELSE IF method is not 'POST'
    * Render the 'Register' HTML script again

> **4. Route ['/HomePage'](http://3.213.134.99:5000/HomePage)**
* Landing Page - HomePage after the user has Logged In
#### HomePage
`Function parameters: { }`
* Bring in the 'user' variable declared globally for session control
* IF the user is in session
  * Render the 'HomePage' HTML script with user variable
* ELSE
  * Remove the user from the session
  * Render the 'Login' HTML script since the user is out of session

> **5. Route ['/FacialPain'](http://3.213.134.99:5000/FacialPain)**
* FacialPain_Form Page to Upload a Video for running the Facial Algorithm
#### FacialPain
`Function parameters: { }`
* Bring in the 'user' variable declared globally for session control
* IF the user is in session
  * Render the 'FacialPain_Form' HTML script with user variable
* ELSE
  * Remove the user from the session
  * Render the 'Login' HTML script since the user is out of session

> **6. Route ['/PupilPain'](http://3.213.134.99:5000/PupilPain)**
* PupilPain_Form Page to Upload a Video for running the Pupil Algorithm
#### PupilPain
`Function parameters: { }`
* Bring in the 'user' variable declared globally for session control
* IF the user is in session
  * Render the 'PupilPain_Form' HTML script with user variable
* ELSE
  * Remove the user from the session
  * Render the 'Login' HTML script since the user is out of session

> **6. Route ['/Logout'](http://3.213.134.99:5000/Logout)**
* Logs out the user from the WebApp and clears the session
#### Logout
`Function parameters: { }`
* Remove the user from the session
* Flash a message for user saying 'Logout Success'
* Render the 'Login' HTML script since the user is not in session anymore
