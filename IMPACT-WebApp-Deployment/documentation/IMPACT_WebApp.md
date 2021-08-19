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
