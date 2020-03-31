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
- DEL /del_thread
- GET /threads
- GET /replies
- GET /threads/:id
- PATCH /threads

#### User-Related Routes
- POST /add_user
- POST /users/login
- GET /users
- PATCH /users
- PATCH /users/privileges/:username
- DEL /users/delete/:username

#### Inbox-Related Routes
- POST /inboxes
- GET /inboxes
- DEL /inboxes
- PATCH /inboxes/add_newActivity
- PATCH /inboxes/delete_newActivity
- PATCH /inboxes/add_pastPosts
- PATCH /inboxes/delete_pastPosts
- PATCH /inboxes/delete_oldActivity
