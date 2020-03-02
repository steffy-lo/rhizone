import React from 'react';
import { Redirect, Link } from "react-router-dom";
import './styles.css';

import * as Data from './../../data/hardcoded.js';
import ls from 'local-storage';

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
        const user = props.state.username;
        if (Data.inboxData.has(user)) {
            this.state = {
                username: user,
                newActivity: Data.inboxData.get(user).newActivity,
                oldActivity: Data.inboxData.get(user).oldActivity,
                loggedIn: props.state.loggedIn
            }
        } else {
            this.state = {
                username: "",
                newActivity: [],
                oldActivity: []
            }
        }
    };

    componentWillMount() {
        if (ls.get('loggedIn') !== undefined) {
            if (ls.get('loggedIn') === true) {
                this.setState({
                    username: ls.get('username'),
                    loggedIn: ls.get('loggedIn'),
                    newActivity: Data.inboxData.get(ls.get('username')).newActivity,
                    oldActivity: Data.inboxData.get(ls.get('username')).oldActivity,
                });
            } else {
                this.setState({
                    username: null,
                    loggedIn: ls.get('loggedIn')
                });
            }
        }
      }

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

        const actName = (Data.userData.get(this.state.username).isAdmin)?
           refContent.author : "Anonymous";

        return (
            <div className='activity' key={idx} atype={aType}>
                <Link className='activity-link' to={"./../thread#"+activity}
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
        if (this.state.loggedIn) {
            return(
                <div>
                    <div className="jumbotron text-center">
                        <Link className='main-page' to={"/"}>
                            <h1>The RhiZone</h1>
                        </Link>
                    </div>
                    <div id='user'>
                        <Link className='user-link' to={"./../Settings"}>
                            <span className='username'> {this.state.username} </span>
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
        } else {
            return (<Redirect to = {'/login'} />);
        }
    }
}


export default Inbox;
