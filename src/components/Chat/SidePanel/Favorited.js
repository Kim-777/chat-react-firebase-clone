import React, { Component } from 'react'
import { FaRegSmileBeam } from 'react-icons/fa'
import firebase from '../../../firebase';
import { connect } from 'react-redux';
import { setCurrentChatRoom, setPrivateChatRoom } from '../../../redux/actions/chatRoom';

class Favorited extends Component {

    state = {
        usersRef: firebase.database().ref("users"),
        favoritedChatRooms: [],
        activeChatRoomId: "",
    }

    componentDidMount() {
        console.log('Favorited componentDidMount1111111')
        setTimeout(() => {
            if(this.props.user) {
                console.log('Favorited componentDidMount222222')
                this.addListeners(this.props.user.uid) 
            }
        }, 1000);
    }

    componentWillUnmount() {
        if(this.props.user) {
            this.removeListener(this.props.user);
        }
    }

    removeListener = userId => {
        this.state.usersRef.child(`${userId}/favorited`).off();
    }

    addListeners = userId => {

        const { usersRef } = this.state;

        usersRef
            .child(userId)
            .child("favorited")
            .on("child_added", DataSnapshot => {
                const favoritedChatRoom = {id: DataSnapshot.key, ...DataSnapshot.val()};
                this.setState({
                    favoritedChatRooms: [...this.state.favoritedChatRooms, favoritedChatRoom]
                })

                console.log("????")
            })

        usersRef
            .child(userId)
            .child("favorited")
            .on("child_removed", DataSnapshot => {
                const chatRoomToRemove = {id: DataSnapshot.key, ...DataSnapshot.val()};
                const filteredChatRooms = this.state.favoritedChatRooms.filter(chatRoom => chatRoom.id !== chatRoomToRemove.id)
                this.setState({favoritedChatRooms: filteredChatRooms})
            })
    };

    changeChatRoom = room => {
        this.props.dispatch(setCurrentChatRoom(room));
        this.props.dispatch(setPrivateChatRoom(false));
        this.setState({activeChatRoomId: room.id});
    }

    renderFavoritedChatRooms = favoritedChatRooms => (
        favoritedChatRooms.length > 0 &&
        favoritedChatRooms.map(chatRoom => (
            <li
                key={chatRoom.id}
                onClick={() => this.changeChatRoom(chatRoom)}
                style={{
                    backgroundColor: chatRoom.id === this.state.activeChatRoomId && "#FFFFFF45"
                }}
            >
                #{chatRoom.name}
            </li>
        ))
    )

    render() {
        
        const { favoritedChatRooms } = this.state;

        return (
            <div>
                <span style={{ display: 'flex', alignItems: 'center'}}>
                    <FaRegSmileBeam style={{marginRight: '3px'}} />
                    FAVORITED (1)
                </span>
                <ul style={{ listStyleType: 'none', padding: '0'}}>
                    {this.renderFavoritedChatRooms(favoritedChatRooms)}
                </ul>
            </div>
        )
    }
}

export default connect(
    ({user}) => ({
        user: user.currentUser,
    })
)(Favorited)
