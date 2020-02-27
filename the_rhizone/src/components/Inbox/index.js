import React from 'react';
import { Link } from "react-router-dom";
import './styles.css';

import * as Data from './../../data/hardcoded.js';

const inboxType = {
    REPLY: 'reply'
};

const actType = {
    NEW: 'new',
    OLD: 'old'
}

class Inbox extends React.Component {
    constructor(props) {
        super(props);
        const user = props.state.userName;

        if (Data.inboxData.has(user)) {
            this.state = {
                userName: user,
                newActivity: Data.inboxData.get(user).newActivity,
                oldActivity: Data.inboxData.get(user).oldActivity
            }
        } else {
            this.state = {
                userName: "",
                newActivity: [],
                oldActivity: []
            }
        }
    };

    // move activity from newActivity to oldActivity
    read(key,type) {
        // check state if newActivity
        if (type === actType.OLD) { return; }
        const idx = key;
        const act = this.state.newActivity[idx];
        // since state values cannot be directly modified
        // directly push/pop arrays in state
        // create temp value n1, o1
        const n1 = this.state.newActivity.splice(idx,1);
        const o1 = this.state.oldActivity.splice(0,0,act);
        this.setState({newActivity:n1, oldActivity:o1});
    }

    /*
     * Render one activity in the list with specs actContent
     * parameters:
     *      activity - referencing to thread id
     *      idx - arrayIndex
     *      aType - activity type, NEW or OLD
    */
    renderOneActivity(activity, idx, aType) {
        const refContent = Data.threadData.get(activity);
        if (!refContent)
        {
            console.log("activity does not exist! Activity: " + activity);
            return;
        }

        const actName =
            (Data.userData.get(this.state.userName))? "Anonymous" : refContent.author;

        return (
            <div className='activity' key={idx} atype={aType}>
                <Link className='activity-link' to={"./../Thread#"+activity}
                    onClick={ () => this.read(idx,aType)}>
                    <p>
                        <span className='actauthor'> {actName} </span>.
                        <span className='acttitle'> {refContent.content.title} </span>.
                    </p>
                </Link>
            </div>
        );
    }

    render() {
        return(
            <div>
                <div className="jumbotron text-center">
                        <h1><a href="/">The RhiZone</a></h1>
                </div>
                <div id='user'>
                    <Link className='user-link' to={"./../Settings"}>
                        <span className='username'> {this.state.userName} </span>
                    </Link>
                </div>
                <div id="newactivity">
                    <div className='actcollection'>
                        New Activity ({this.state.newActivity.length}):
                    </div>
                    {this.state.newActivity.map((d,key) => /* d- array data; key- array index*/
                        this.renderOneActivity(d,key, actType.NEW))}
                </div>
                <div id="oldactivity">
                    <div className='actcollection'>
                        Old Activity ({this.state.oldActivity.length}):
                    </div>
                    {this.state.oldActivity.map((d,key) =>
                        this.renderOneActivity(d,key, actType.OLD))}
                </div>
            </div>
        );
    }
}


export default Inbox;
