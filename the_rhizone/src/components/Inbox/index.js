import React from 'react';
import { Link } from "react-router-dom";
import './styles.css';

const inboxType = {
    REPLY: 'reply',
    TAG: 'tag'
};

const actType = {
    NEW: 'new',
    OLD: 'old'
}

class Inbox extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            userName: inboxData[0].userName,
            newActivity: inboxData[0].newActivity,
            oldActivity: inboxData[0].oldActivity
        }
    }

    // move activity from new to old
    read(key,type) {
        // check state if newActivity
        if (type === actType.OLD) { return; }
        const idx = key;
        const act = this.state.newActivity[idx];
        const a1 = this.state.newActivity.splice(idx,1);
        const o1 = this.state.oldActivity.splice(0,0,act);
        this.setState({newActivity:a1, oldActivity:o1});
    }

    getImagePath(userName) {
        let imgSrc;
        for (let user of userData) {
            if (userName === user.userName)
            {
                imgSrc = user.profile;
                break;
            }
        }
        if (imgSrc === ''){
            return require('./images/default.png');
        }
        return require('./images/' + imgSrc);
    }

    // render one activity in the list with specs actContent
    renderOneActivity(actContent, key, type) {
        // may need to query for thread data later
        let actThread;
        for (let thread of threadData) {
            if (actContent.author === thread.author
            && actContent.threadID === thread.id)
            {
                actThread = thread;
                break;
            }
        }

        if (actThread === null) {
            console.log("unable to render current activity");
            console.log(actContent);
            return;
        }
        const typeHeader = (actContent.type === inboxType.REPLY)?
        'New reply from ': 'You were tagged by ';

        return (
            <div className='activity' key={key} type={type}>
                <Link className='activity-link' to={"./../Thread"}
                    onClick={ () => this.read(key,type)}>
                <p>
                    <span className='actheader'> {typeHeader} </span>
                    <span className='actauthor'> {actThread.content.name} </span>
                    .
                    <span className='actgenre'> [{actThread.content.genre}] </span>
                    <span className='acttitle'> {actThread.content.title} </span>
                    .
                </p>
                </Link>
            </div>
        );
    }

    render() {
        return(
            <div>
                <div id='user'>
                    <Link className='user-link' to={"./../Settings"}>
                        <div className='profileicon'>
                            <img src={this.getImagePath(this.state.userName)} alt=""/>
                        </div>
                        <span className='username'>{this.state.userName} </span>
                    </Link>
                </div>
                <div id="newactivity">
                    <div className='actcollection'> New Activity ({this.state.newActivity.length}): </div>
                    {this.state.newActivity.map((d,key) =>
                        this.renderOneActivity(d,key, actType.NEW))}
                </div>
                <div id="oldactivity">
                    <div className='actcollection'> Old Activity ({this.state.oldActivity.length}): </div>
                    {this.state.oldActivity.map((d,key) =>
                        this.renderOneActivity(d,key, actType.OLD))}
                </div>
            </div>
        );
    }
}

// Hard-coded data bellow
const inboxData = [
    {
        userName:'user',
        newActivity: [
            {type: "reply", author:'user2', threadID: 0},
            {type: "tag", author:'user2',threadID: 1}
        ],
        oldActivity: [
            {type: "reply", author:'user2', threadID: 2}
        ]
    }
]

const userData = [
    {userName:'user', password:'user', isAdmin: false, profile:'user.png'},
    {userName:'user2', password:'user2', isAdmin: false, profile:''},
    {userName:'admin', password:'admin', isAdmin: true, profile:''}
]

const threadData = [
    {author:'user', id:0,
        parent:{},
        content:{
            name: 'Anonymous',
            genre: 'Film',
            title: "testing1",
            content: "",
            image: "",
            tag: []
        }
    },
    {author:'user2', id:0,
        parent:{author:'user', id:0},
        content:{
            name: 'user2',
            genre: 'Music',
            title: "testing2",
            content: "",
            image: "",
            tag: []
        }
    },
    {author:'user2', id:1,
            parent:{author:'user', id:0},
            content:{
                name: 'Anonymous',
                genre: 'Art',
                title: "testing3",
                content: "",
                image: "",
                tag: ["user"]
            }
    },
    {author:'user2', id:2,
        parent:{},
        content:{
            name: 'Anonymous',
            genre: 'Art',
            title: "testing4",
            content: "",
            image: "",
            tag: ["user"]
        }
    }
]

export default Inbox;
