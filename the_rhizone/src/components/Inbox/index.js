import React from 'react';
import { Redirect, Link } from "react-router-dom";
import './styles.css';
import * as Data from './../../data/hardcoded.js';
import ls from 'local-storage';
import Button from "@material-ui/core/Button";

const inboxType = {
    REPLY: 'reply'
};

const actType = {
    NEW: 'new',
    OLD: 'old',
    PAST: 'past'
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
                pastPosts: Data.inboxData.get(user).pastPosts,
                loggedIn: props.state.loggedIn
            }
        } else {
            this.state = {
                username: "",
                newActivity: [],
                oldActivity: [],
                pastPosts:[]
            }
        }
    };

    componentWillMount() {
        if (ls.get('loggedIn') !== undefined) {
            if (ls.get('loggedIn') === true) {
                const user = ls.get('username');
                this.setState({
                    username: user,
                    loggedIn: ls.get('loggedIn'),
                    newActivity: Data.inboxData.get(user).newActivity,
                    oldActivity: Data.inboxData.get(user).oldActivity,
                    pastPosts: Data.inboxData.get(user).pastPosts,
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
        if (type !== actType.NEW) { return; }
        const idx = key;
        const act = this.state.newActivity[idx];
        // since state values cannot be directly modified
        // directly push/pop arrays in state
        // create temp value n1, o1
        const n1 = this.state.newActivity;
        n1.splice(idx,1);
        const o1 = this.state.oldActivity;
        o1.splice(0,0,act);
        this.setState({newActivity:n1, oldActivity:o1});
    }

    removeThread(activity, idx, type){
        //Data.threadData.delete(activity);
        switch (type){
            case actType.NEW:
                const n1 = this.state.newActivity;
                n1.splice(idx,1);
                this.setState({newActivity:n1});
                break;
            case actType.OLD:
                const o1 = this.state.oldActivity;
                o1.splice(idx,1);
                this.setState({oldActivity:o1});
                break;
            case actType.PAST:
                const p1 = this.state.pastPosts;
                p1.splice(idx,1);
                this.setState({pastPosts:p1});
                break;
            default:
                break;
        }
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

        const actName = (Data.userData.get(this.state.username).isAdmin)? refContent.author : "Anonymous";

        const msg = (aType === actType.PAST)? " created thread: " : " replies to your thread:";

        return (
            <div className='activity' key={idx} atype={aType}>
                <Link className='activity-link' to={"./../thread#"+activity}
                    onClick={ () => this.read(idx,aType)}>
                    <p>
                    <span className='actauthor'> {actName} </span> {msg}
                    <span className='acttitle'> {refContent.content.body} </span>.
                    </p>
                </Link>
                <button className='pull-right' onClick={() => this.removeThread(activity,idx,aType)}> delete </button>
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
                        <div className="buttons">
                            <Link to={{pathname: '/settings'}}>
                            <Button className="settings">Settings</Button>
                            </Link>
                        </div>
                    </div>
                    <div id='user'>
                        <Link className='user-link' to={"./../Settings"}>
                        <span className='username'> {this.state.username} </span>
                        </Link>
                    </div>
                    <div id="newactivity">
                        <div className='actcollection'> New Activity ({this.state.newActivity.length}):</div>
                        {this.state.newActivity.map((d,key) => this.renderOneActivity(d,key, actType.NEW))}
                    </div>
                    <div id="oldactivity">
                        <div className='actcollection'> Old Activity ({this.state.oldActivity.length}):</div>
                        {this.state.oldActivity.map((d,key) => this.renderOneActivity(d,key, actType.OLD))}
                    </div>
                    <div id="pastactivity">
                        <div className='actcollection'> Past Posts ({this.state.pastPosts.length}): </div>
                        {this.state.pastPosts.map((d,key) =>this.renderOneActivity(d,key, actType.PAST))}
                    </div>
                </div>
            );
        } else {
            return (<Redirect to = {'/login'} />);
        }
    }
}


export default Inbox;
