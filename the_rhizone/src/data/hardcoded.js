// Hard-coded data bellow

// Currently for 6 datasets
const userData = [
    {userName:'user', password:'user', isAdmin: false},
    {userName:'user1', password:'user2', isAdmin: false},
    {userName:'user2', password:'user2', isAdmin: false},
    {userName:'user3', password:'user2', isAdmin: false},
    {userName:'user4', password:'user2', isAdmin: false},
    {userName:'admin', password:'admin', isAdmin: true}
]

const inboxData = [
    // sample for empty user
    {
        userName:'user',
        newActivity: [3,4],
        oldActivity: [5]
    },
    {
        userName:'user1',
        newActivity: [],
        oldActivity: []
    },
    {
        userName:'user2',
        newActivity: [],
        oldActivity: []
    },
    {
        userName:'user3',
        newActivity: [6],
        oldActivity: []
    },
    {
        userName:'user4',
        newActivity: [],
        oldActivity: []
    },
    {
        userName:'admin',
        newActivity: [],
        oldActivity: []
    },
]

// feel free to modify for thread messages
// testing thread id 0-7
// rest of the threads are just placeholders for main page

// total thread count 14 for id 0-13
let threadCount = 14;
const threadData = [
    {
        id:0,
        pid:-1,
        author:"user",
        replies: [],
        content:{
            title: "testing1",
            content: "Testing1 to render root thread",
            imgRef: "",
        }
    },
    {
        id:1,
        pid:-1,
        author:"user",
        replies: [],
        content:{
            title: "testing2",
            content: "Testing to render root thread with image",
            imgRef: "1.jpg",
        }
    },
    {
        id:2,
        pid:-1,
        author:"user",
        replies: [3,4,5],
        content:{
            title: "testing3",
            content: "Testing to render nested reply ",
            imgRef: "1.jpg",
        }
    },
    {
        id:3,
        pid:2,
        author:"user1",
        replies: [],
        content:{
            title: "testing3",
            content: "First reply to testing 3, without image",
            imgRef: "",
        }
    },
    {
        id:4,
        pid:2,
        author:"user2",
        replies: [],
        content:{
            title: "testing3",
            content: "Second reply to testing 3, with image",
            imgRef: "firstframeofida.png",
        }
    },
    {
        id:5,
        pid:2,
        author:"user3",
        replies: [6],
        content:{
            title: "testing4",
            content: "Testing for reply of relies",
            imgRef: "leorangeman.jpg",
        }
    },
    {
        id:6,
        pid:5,
        author:"user",
        replies: [],
        content:{
            title: "testing4",
            content: "Actual reply to reply 5",
            imgRef: "leorangeman.jpg",
        }
    },
    // Question: should admin message be the same or different from regular user postings
    {
        id:7,
        pid:-1,
        author:"admin",
        replies: [],
        content:{
            title: "testing",
            content: "Placeholder for other testings",
            imgRef: "",
        }
    },
    {
        id:8,
        pid:-1,
        author:"user",
        replies: [],
        content:{
            title: "testing",
            content: "Placeholder for other testings",
            imgRef: "",
        }
    },
    {
        id:9,
        pid:-1,
        author:"user",
        replies: [],
        content:{
            title: "testing",
            content: "Placeholder for other testings",
            imgRef: "",
        }
    },
    {
        id:10,
        pid:-1,
        author:"user",
        replies: [],
        content:{
            title: "testing",
            content: "Placeholder for other testings",
            imgRef: "",
        }
    },
    {
        id:11,
        pid:-1,
        author:"user",
        replies: [],
        content:{
            title: "testing",
            content: "Placeholder for other testings",
            imgRef: "",
        }
    },
    {
        id:12,
        pid:-1,
        author:"user",
        replies: [],
        content:{
            title: "testing",
            content: "Placeholder for other testings",
            imgRef: "",
        }
    },
    {
        id:13,
        pid:-1,
        author:"user",
        replies: [],
        content:{
            title: "testing",
            content: "Placeholder for other testings",
            imgRef: "",
        }
    }
]