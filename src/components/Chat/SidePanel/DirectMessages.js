import React, { Component } from 'react';
import {
    FaRegSmile,
} from 'react-icons/fa';
import firebase from '../../../firebase';
import { connect } from 'react-redux'; 
import {
    setCurrentChatRoom,
    setPrivateChatRoom,
} from '../../../redux/actions/chatRoom';

class DirectMessages extends Component {

    state = {
        usersRef: firebase.database().ref("users"),
        users: [],
        activeChatRoom: "",
    }

    componentDidMount() {
        console.log('here directMessages');
        console.log('usersssser', this.props);
        setTimeout(() => {
            if(this.props.user) {
                console.log('why not?')
                this.addUsersListeners(this.props.user.uid);
            }
        }, 1000);
    }


    addUsersListeners = currentUserId => {
        const { usersRef } = this.state;
        let usersArray = [];
        usersRef.on("child_added", DataSnapshot => {
            if(currentUserId !== DataSnapshot.key) {
                let user = DataSnapshot.val();
                console.log('Datasnapshot.val()', DataSnapshot.val());
                user["uid"] = DataSnapshot.key;
                user["status"] = "offline";
                usersArray.push(user);
                this.setState({users: usersArray});
            }
        })
    }

    getChatRoomId = userId => {
        const currentUserId = this.props.user.uid;

        return userId > currentUserId ? `${userId} / ${currentUserId}` : `${currentUserId} / ${userId}`  
    }


    changeChatRoom = user => {
        const chatRoomId = this.getChatRoomId(user.uid);
        const chatRoomData = {
            id: chatRoomId,
            name: user.name,
        };

        this.props.dispatch(setCurrentChatRoom(chatRoomData));
        this.props.dispatch(setPrivateChatRoom(true));
        this.setActiveChatRoom(user.uid);
    };

    setActiveChatRoom = userId => {
        this.setState({activeChatRoom: userId})
    }

    renderDirectMessages = users => (
        users.length > 0 &&
        users.map(user => (
            <li 
                onClick={() => this.changeChatRoom(user)}
                key={user.uid}
                style={{
                    backgroundColor: user.uid === this.state.activeChatRoom && "#FFFFFF45"
                }}
            >
                # {user.name}
            </li>
        ))
    )

    render() {
        
        const { users } = this.state;

        return (
            <div>
                <span style={{display: 'flex', alignItems: 'center'}}>
                    <FaRegSmile style={{ marginRight: 3}}/> DIRECT MESSAGES(1)
                </span>

                <ul style={{ listStyleType: 'none', padding: 0}}>
                    {this.renderDirectMessages(users)}
                </ul>
            </div>
        )
    }
}


export default connect(
    ({user}) => ({
        user: user.currentUser
    }),
)(DirectMessages);
