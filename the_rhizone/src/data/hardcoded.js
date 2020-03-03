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
inboxData.set('user', {newActivity:[3,4], oldActivity:[5], pastPosts[0,1,2,6,8,9,10,11,12]});
inboxData.set('user1', {newActivity:[],oldActivity:[], pastPosts[3]});
inboxData.set('user2', {newActivity:[],oldActivity:[], pastPosts[4]});
inboxData.set('user3', {newActivity:[6],oldActivity:[], pastPosts[5]});
inboxData.set('user4', {newActivity:[],oldActivity:[], pastPosts[]});
inboxData.set('admin', {newActivity:[],oldActivity: [], pastPosts[7]});


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
            title: "Does RhiZone agree with Adorno on the Culture Industry?",
            body: "Ultimately in the essay The Culture Industry in the Dialectics of Enlightenments, Adorno claims all works of popular culture can never be art. Do you agree or disagree?",
            imgRef: "",
        }
    });
threadData.set(1, {pid:-1, author:"user", replies: [],
        content:{
            title: "What is your opinion of Ida?",
            body: "2014's Ida for me is one of the best films of the decade. It is a look into post-Holocaust Poland, exploring the angst, anxiety and loss of direction that comes from an event we cannot make sense of.",
            imgRef: "1.jpg",
        }
    });
threadData.set(2, {pid:-1, author:"user", replies: [3,4,5],
        content:{
            title: "Ida is a dissapointment",
            body: "I expected a lot out of this film given all the hype around it, but I found it rather pretentious in its execution and on-the-nose in its messaging. ",
            imgRef: "1.jpg",
        }
    });
threadData.set(3, {pid:2, author:"user1", replies: [],
        content:{
            title: "",
            body: "You fundamentally misunderstand the movie. @1 gets it. But Pawlikowski is continuing on his work which contemplates the movement image and its dialectical relationship with the time image here.",
            imgRef: "",
        }
    });
threadData.set(4, {pid:2, author:"user2", replies: [],
        content:{
            title: "",
            body: "Look at this shot. Just contemplate it. See how it positions Ida off-centered from the Christ statue. In the very first frame of the film, the film communicates Ida's psychological state without saying a word. That's why the film is genius.",
            imgRef: "firstframeofida.png",
        }
    });
threadData.set(5, {pid:2, author:"user3", replies: [6],
        content:{
            title: "",
            body: "Testing for reply of replies",
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
            title: "testing2",
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
