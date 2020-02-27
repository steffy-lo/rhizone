/* Hard-coded data bellow
 * Example import:
 *     import * as Data from './../../data/hardcoded.js';
 * Usage "Data.userData"
 */

/*
 *      key: userName
 *      value: {password:'', isAdmin: false}
 */
const userData = new Map();
userData.set('user', {password:'user', isAdmin: false});
userData.set('user1', {password:'user1', isAdmin: false});
userData.set('user2', {password:'user2', isAdmin: false});
userData.set('user3', {password:'user3', isAdmin: false});
userData.set('user4', {password:'user4', isAdmin: false});
userData.set('admin', {password:'admin', isAdmin: true});

/*
 *      key: userName
 *      value: {newActivity:[],oldActivity:[]}
 */
const inboxData = new Map();
inboxData.set('user', {newActivity:[3,4], oldActivity:[5]});
inboxData.set('user1', {newActivity:[],oldActivity:[]});
inboxData.set('user2', {newActivity:[],oldActivity:[]});
inboxData.set('user3', {newActivity:[6],oldActivity:[]});
inboxData.set('user4', {newActivity:[],oldActivity:[]});
inboxData.set('admin', {newActivity:[],oldActivity: []});


/*
 * feel free to modify for thread messages
 * testing thread id 0-7
 * rest of the threads are just placeholders for the main page
 */

/*
 *      key: threadId,
 *      value: {pid:-1, author:"", replies[],
 *              content:{title:"", body:"", imgRef:""}}]
 */
const threadData = new Map ();
threadData.set(0, {pid:-1, author:"user", replies: [],
        content:{
            title: "testing1",
            body: "Testing1 to render root thread",
            imgRef: "",
        }
    });
threadData.set(1, {pid:-1, author:"user", replies: [],
        content:{
            title: "testing2",
            body: "Testing to render root thread with image",
            imgRef: "1.jpg",
        }
    });
threadData.set(2, {pid:-1, author:"user", replies: [3,4,5],
        content:{
            title: "testing3",
            body: "Testing to render nested reply ",
            imgRef: "1.jpg",
        }
    });
threadData.set(3, {pid:2, author:"user1", replies: [],
        content:{
            title: "testing3",
            body: "First reply to testing 3, without image",
            imgRef: "",
        }
    });
threadData.set(4, {pid:2, author:"user2", replies: [],
        content:{
            title: "testing3",
            body: "Second reply to testing 3, with image",
            imgRef: "firstframeofida.png",
        }
    });
threadData.set(5, {pid:2, author:"user3", replies: [6],
        content:{
            title: "testing4",
            body: "Testing for reply of relies",
            imgRef: "leorangeman.jpg",
        }
    });
threadData.set(6, {pid:5, author:"user", replies: [],
        content:{
            title: "testing4",
            body: "Actual reply to reply 5",
            imgRef: "leorangeman.jpg",
        }
    });
    // Question: should admin message be the same or different from regular user postings
threadData.set(7, {pid:-1, author:"admin", replies: [],
        content:{
            title: "testing",
            body: "Placeholder for other testings",
            imgRef: "",
        }
    });
threadData.set(8, {pid:-1, author:"user", replies: [],
        content:{
            title: "testing",
            body: "Placeholder for other testings",
            imgRef: "",
        }
    });
threadData.set(9, {pid:-1, author:"user", replies: [],
        content:{
            title: "testing",
            body: "Placeholder for other testings",
            imgRef: "",
        }
    });
 threadData.set(10, {pid:-1, author:"user", replies: [],
        content:{
            title: "testing",
            body: "Placeholder for other testings",
            imgRef: "",
        }
    });
 threadData.set(11, {pid:-1, author:"user", replies: [],
        content:{
            title: "testing",
            body: "Placeholder for other testings",
            imgRef: "",
        }
    });
threadData.set(12, {pid:-1, author:"user", replies: [],
        content:{
            title: "testing",
            body: "Placeholder for other testings",
            imgRef: "",
        }
    });
 threadData.set(13, {pid:-1, author:"user", replies: [],
        content:{
            title: "testing",
            body: "Placeholder for other testings",
            imgRef: "",
        }
    });

export {userData,inboxData,threadData};