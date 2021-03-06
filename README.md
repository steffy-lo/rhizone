# team50

We used React to build our web app.

### Getting Started
To get started with running the app, run the following commands

```
git clone https://github.com/csc309-winter-2020/team50.git
cd ~/the_rhizone
npm install
npm start
```

'''
To access our site on heroku do the following:
Go to the root directory:
cd /team50
then run heroku with heroku open
you will find it open @
In the case that the heroku site is down (this happens when there is no activity for 30 minutes, you will have to start up with heroku open again--for security reasons, I will not put
my heroku login creditions here, but I will email them to you)

To check information on the database, go to mongodb and log in to see our collection. Again, for security reasons, I will not put my creditionals on this readme, but I will email them to you.

Otherwise, you should be able to access the app on this url:

https://rhizones.herokuapp.com/

'''


### Login Credentials
For a regular user
```
username: user
password: user
```

For an admin
```
username: admin
password: admin
```

### About Our App: The RhiZone
RhiZone is an anonymous social media website that promotes a space for users of the Internet to engage freely in discussions, particularly in topics surrounding the liberal arts that are significant and intellectual. Anonymity is key to our website: it prevents users from feeling judged while posting and allows them to speak their thoughts honestly, thereby avoiding other problems with having a so-called identity.

### Features for Regular Users
Regular users can create new threads and post about issues related to literature, film, music, philosophy, etc. but they must do so anonymously. They are also able to receive notifications on their inbox from activities in threads that they post and view corresponding replies.
Users are also able to change their passwords if they wish to.

### Features for Admins
Admins are able to perform any actions that a regular user is able to do in addition to deleting posts/threads, remove and add user accounts

### Overview of Our Routes
#### Thread-Related Routes
- POST /create_thread
Creates a new thread in the database. It receives a json request body with the following keys
-- pid: the parent thread id; if the thread doesn't have a parent, then it will be -1
-- author: the username of the user who created the thread
-- content: an object containing the thread's title, body, and imgRef
The resulting saved thread will be sent back as a response.

Example request body:
```
{
	pid: -1,
	author: "user",
	content: {
		title: "Hello World!"
		body: "Hope everyone is doing fine."
		imgRef: ""
	}
}
```
- DEL /del_thread
Removes a thread from the database given the thread id passed in as an argument through the url, and updates any parent thread accordingly by removing the given thread id from its parent thread replies attribute.
Sends back the deleted thread object as a response.

- GET /threads
Retrieves a thread with the provided thread id (from url) or all the threads if no thread id is provided.
Request url format: '/threads/?id=<thread id>'


- GET /replies
Retrieves the threads (as a list) that are replies to the given list of thread ids passed in as a string argument separated by commas from the url.

- GET /threads/:id
Gets a thread object with the given id.

- PATCH /threads
Expects a json request body with two thread ids, where the second thread id is a reply to the thread with the first id. Note: replies are threads without title.
Updates the first thread by pushing the second thread id onto its list of replies.
The updated thread is then sent back as a response.

Example request body:
```
{
	"id": <first thread id>,
	"reply": <second thread id>
}
```

#### User-Related Routes
- POST /add_user
Expects a json request body with the new user's username, password, and a boolean that indicates whether this new user is an admin or not. The newly created and saved user object will then be send back as a response.

Example request body:
```
{
	"username": "user",
	"password": "user",
	"isAdmin: false
}
```

- POST /users/login
Logs in a user by validating if the given username exists and that the corresponding password is valid.

- GET /users
Expects a username passed in from the url and finds the user with the username that was provided. The user object is sent back as a response.
Example request url: '/users/?userName=user

- PATCH /users
Expects a json request body with username and password as its keys and the user's username and new password as its value. This route updates the user with the given username's password with the new password that was passed in. The updated new user object is then sent back as a response.

Example request body:
```
{
	"username": "user",
	"password": "password"
}
```

- PATCH /users/privileges/:username
Updates the user with the given username passed in to have admin privileges. The updated user object is then sent back as a response.

- DEL /users/delete/:username
Removes the user with the given username from the database. The removed user is then sent back as a response.

#### Inbox-Related Routes
- POST /inboxes
Create new inbox data when a new user is created. Expects:
-- userName of type string
-- newActivity/oldActivity/pastPosts of type Array
If above format is not followed, will return 400 Bad Request.

- GET /inboxes
Retrieves user inbox data based on userName query. If userName is not found in the database, 404 error code will be returned.

- DEL /inboxes
Removes user inbox data based on userName query. If userName is not found in the database, 404 error code will be returned.

- PATCH /inboxes/add_newActivity
Retrieves inbox data with userName, and pushes an object element, containing rootID for thread page linking and activityID for current thread identification, into the newActivity array of the inbox data.  

Example request body:
```
{
    "userName": "user",
    "newActivity": {rootID:<parent thread id>, activityID:<current thread id>}
}
```

- PATCH /inboxes/delete_newActivity
Deletes an object element in the newActivity array, if the userName of inbox data matches and acitvityID of that object matches the "newActivity" thread id provided in the request body.

Example request body:
```
{
    "userName": "user",
    "newActivity": "thread id"
}
```

- PATCH /inboxes/add_pastPosts
Similar to add_newActivity, except the target array is pastPosts within the inbox data.

- PATCH /inboxes/delete_pastPosts
Similar to delete_newActivity, except the target array is pastPosts within the inbox data.

- PATCH /inboxes/delete_oldActivity
Similar to delete_newActivity, except the target array is oldActivity within the inbox data.

#### Image-Related Routes
- POST /images
Creates an image and saves it into the database. Expects image data in its request body.

- DEL /images/:imageId
Deletes the image from cloudinary server and the database. Sends back the deleted image as a response.
