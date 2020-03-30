import React from 'react';
import { Redirect, Link } from "react-router-dom";
import './styles.css';
import * as Data from './../../data/hardcoded.js';
import ls from 'local-storage';
import Button from "@material-ui/core/Button";
const log = console.log

const actType = {
    NEW: 'new',
    OLD: 'old',
    PAST: 'past'
}
const url = '/inboxes'
const userUrl = '/users'
const threadUrl = '/threads'

class Inbox extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            userName: "",
            newActivity: [],
            oldActivity: [],
            pastPosts:[],
            loggedIn: false
        }
    };

    getInbox(user) {
        const customUrl = url +  '/?userName=' + user
        // Create our request constructor with all the parameters we need
        const request = new Request( customUrl, {
            method: 'GET',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json'
            },
        });

        // Send the request with fetch()
        fetch(request)
        .then( res => {
            // Handle response we get from the API.
            if (res.status === 200) {
                // user found
                log('user found')
                return res.json();
            } else {
                log('Failed to get inbox data with userName:' + user)
                return null;
            }
        }).then (
            res => {
            if (res === null) { return; }
            this.setStateWithQueryData(res);
        })
    }

    setStateWithQueryData(queryData) {
        log(queryData)
        this.setState({
            userName: queryData.userName,
            newActivity: Array.from(queryData.newActivity),
            oldActivity: Array.from(queryData.oldActivity),
            pastPosts: Array.from(queryData.pastPosts),
        })
    }

    componentWillMount() {
        if (ls.get('loggedIn') === true) {
            //const user = ls.get('user').username;
            const user = this.props.state.user.userName;
            this.getInbox(user);
            this.setState({
                loggedIn: ls.get('loggedIn')
            })
        } else {
            this.setState({
                userName: null,
                loggedIn: ls.get('loggedIn')
            });
        }
    }

    deleteInbox(user) {
        const customUrl = url +  '/?userName=' + user
        // Create our request constructor with all the parameters we need
        const request = new Request( customUrl, {
            method: 'delete',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json'
            },
        });

        // Send the request with fetch()
        fetch(request)
        .then( res => {
            // Handle response we get from the API.
            if (res.status === 200) {
                // user found
                log('user inbox deleted')
            } else {
                log('Failed to delete inbox data with userName:' + user)
                return null;
            }
        }).catch((error) => {
            log(error)
        })
    }

    addInbox() {
        // Create our request constructor with all the parameters we need
        let data = {
            userName: this.state.userName,
            newActivity: this.state.newActivity,
            oldActivity: this.state.oldActivity,
            pastPosts: this.state.pastPosts
        }
        const request = new Request( url, {
            method: 'post',
            body: JSON.stringify(this.state),
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json'
            },
        });

        // Send the request with fetch()
        fetch(request)
        .then( res => {
            // Handle response we get from the API.
            if (res.status === 200) {
                // user found
                log('user inbox added')
                return res.json();
            } else {
                log('Failed to add user inbox')
                return null;
            }
        }).catch((error) => {
            log(error)
        })
    }

    updateInbox() {
        this.deleteInbox(this.state.userName);
        this.addInbox();
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

        const newStates = {
            newActivity: n1,
            oldActivity: o1,
            pastPosts: this.state.pastPosts
        }
        this.setState(newStates);
        this.updateInbox();
    }

    removeActivity(hash, delUrl){
        const data = {
            userName: this.state.userName,
            pastPosts: hash
        }

        const request = new Request(delUrl, {
            method: 'PATCH',
            body: JSON.stringify(data),
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json'
            },
        });

        // Send the request with fetch()
        fetch(request)
        .then(function(res) {
            if (res.status === 200) {
                console.log('activity deleted')
                return res.json();
            } else {
                console.log('Failed to delete activity')
                return null;
            }
        }).catch((error) => {
            console.log(error)
        });
	}

    removeThread(activity, idx, type){
        switch (type){
            case actType.NEW:{
                const n1 = this.state.newActivity;
                const targetAct = n1.splice(idx,1);
                this.removeActivity(targetAct.activityID, url + '/delete_newActivity');
                this.setState({newActivity:n1});
                }
                break;
            case actType.OLD:{
                const o1 = this.state.oldActivity;
                const targetAct = o1.splice(idx,1);
                this.removeActivity(targetAct.activityID, url + '/delete_oldActivity');
                this.setState({oldActivity:o1});
                }
                break;
            case actType.PAST:{
                const p1 = this.state.pastPosts;
                const targetAct = p1.splice(idx,1);
                this.removeActivity(targetAct.activityID, url + '/delete_pastPosts');
                this.setState({pastPosts:p1});
                }
                break;
            default:
                break;
        }
        this.updateInbox();
    }

    setPostAuthor(user, idx, aType, author) {
        const customUrl = userUrl +  '/?userName=' + user
        // Create our request constructor with all the parameters we need
        const request = new Request( customUrl, {
            method: 'get',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json'
            },
        });

        // Send the request with fetch()
        fetch(request)
        .then( res => {
            // Handle response we get from the API.
            if (res.status === 200) {
                // user found
                log('user found')
                return res.json();
            } else {
                log('Failed to get user data with userName:' + user)
                return null;
            }
        }).then (
            res => {
            if (res === null) { return; }
            if (res.isAdmin) {
                const queryString = 'div[class="activity"][aType="' + aType + '"]';
                //log(queryString);
                const targetAct = document.querySelectorAll(queryString)[idx];
                //log(targetAct);
                if (targetAct === null){
                    return;
                }
                const targetName = targetAct.querySelector('.actauthor');
                targetName.innerHTML = author;
            }
        })
    }

    getThread(activity, idx, aType) {
            const customUrl = threadUrl + '/' +  activity.activityID;
            // Create our request constructor with all the parameters we need
            const request = new Request( customUrl, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json, text/plain, */*',
                    'Content-Type': 'application/json'
                },
            });

            const component = this;
            const componentUser = this.state.userName;

            fetch(request)
            .then( res => {
                if (res.status === 200) {
                    log('thread found')
                    return res.json();
                } else {
                    log('Failed to get thread data with hash:' + activity.activityID);
                    return null;
                }
            }).then (
                res => {
                if (res === null) { return; }
                const queryString = 'div[class="activity"][aType="' + aType + '"]';
                const targetAct = document.querySelectorAll(queryString)[idx];
                if (targetAct === null){
                    return;
                }
                const targetTitle = targetAct.querySelector('.acttitle');
                targetTitle.innerHTML = res.content.body;
                component.setPostAuthor(componentUser, idx, aType, res.author);
            })
        }

    /*
     * Render one activity in the list with specs actContent
     * parameters:
     *      activity - referencing to thread id
     *      idx - arrayIndex
     *      aType - activity type, NEW or OLD
    */
    renderOneActivity(activity, idx, aType) {
        //const refContent = Data.threadData.get(activity);

        const actName = (aType === actType.PAST)? "" : "Anonymous";
        // back-end set content
        this.getThread(activity, idx, aType);

        const msg = (aType === actType.PAST)? "Posted: " : " replies to your thread:";

        return (
            <div className='activity' key={idx} atype={aType}>
                <Link className='activity-link' to={"./../thread#"+activity.rootID}
                    onClick={ () => this.read(idx,aType)}>
                    <p>
                    <span className='actauthor'> {actName} </span> {msg}
                    <span className='acttitle'>Post Content Deleted</span>.
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
                        <img className="title" src={require('./../../images/logo.png')}/>
                        <div className="buttons">
                            <div className="LinkMeLogin" onClick={() => this.props.login(false)} ><Link to="/">
                                <Button>Logout</Button>
                                </Link>
                            </div>	
                            <div className="LinkMeSettings" >
                                <Link to="/settings">
                                <Button>Settings</Button>
                                </Link>
                            </div>
                            <div className="LinkMeHome" >
                                <Link to="/">
                                <Button>Home</Button>
                                </Link>
                            </div>
                        </div>
                    </div>
                    <div id='user'>
                        <Link className='user-link' to={"./../Settings"}>
                        <span className='username'> {this.state.userName} </span>
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
