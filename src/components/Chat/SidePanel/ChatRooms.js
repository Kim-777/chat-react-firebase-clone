import React, { Component } from 'react'
import { FaRegSmileWink } from 'react-icons/fa';
import { FaPlus } from 'react-icons/fa';
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button';
import Badge from '../../../common/components/Badge/Badge';
import Form from 'react-bootstrap/Form';
import { connect } from 'react-redux';
import firebase from '../../../firebase';
import {
    setCurrentChatRoom, 
    setPrivateChatRoom,
} from '../../../redux/actions/chatRoom';


export class ChatRooms extends Component {

    state = {
        show: false,
        name: "",
        description: "",
        chatRoomsRef: firebase.database().ref("chatRooms"),
        messagesRef: firebase.database().ref("messages"),
        chatRooms: [],
        firstLoad: true,
        activeChatRoomId: "",
        notifications: [],
    }

    componentDidMount() {
        this.AddChatRoomsListeners();
    }

    componentWillUnmount() {
        this.state.chatRoomsRef.off();

        this.state.chatRooms.forEach(chatRoom => {
            this.state.messagesRef.child(chatRoom.id).off();
        })
    }

    setFirstChatRoom = () => {
        const firstChatRoom = this.state.chatRooms[0];
        if(this.state.firstLoad && this.state.chatRooms.length > 0) {
            this.props.dispatch(setCurrentChatRoom(firstChatRoom));
            this.setState({activeChatRoomId: firstChatRoom.id})
        } 
        this.setState({firstLoad: false})
    }

    AddChatRoomsListeners = () => {
        let chatRoomsArray = [];

        this.state.chatRoomsRef.on("child_added", DataSnapshot => {
            chatRoomsArray.push(DataSnapshot.val());
            this.setState({chatRooms: chatRoomsArray}, () => this.setFirstChatRoom());
            this.addNotificationListener(DataSnapshot.key)
        });
    };

    addNotificationListener = chatRoomId => {
        this.state.messagesRef.child(chatRoomId).on("value", DataSnapshot => {
            if(this.props.chatRoom) {
                this.handleNotification(
                    chatRoomId,
                    this.props.chatRoom.id,
                    this.state.notifications,
                    DataSnapshot,
                )
            }
        })
    }

    handleNotification = (chatRoomId, currentChatRoomId, notifications, DataSnapshot) => {

        let lastTotal = 0;

        let index = notifications.findIndex(notification => notification.id === chatRoomId)

        // notifications state 안에 해당 채팅방의 알림 정보가 없을때 
        if(index === -1) {
            notifications.push({
                id: chatRoomId,
                total: DataSnapshot.numChildren(),
                lastKnownTotal: DataSnapshot.numChildren(),
                count: 0,
            })
        } else {
        
            if(chatRoomId !== currentChatRoomId) {
                lastTotal = notifications[index].lastKnownTotal;

                if(DataSnapshot.numChildren() - lastTotal > 0) {
                    notifications[index].count = DataSnapshot.numChildren() - lastTotal;
                }
            }

            notifications[index].total = DataSnapshot.numChildren();
        }

        this.setState({notifications})

    }

    handleClose = () => this.setState({show: false});
    handleShow = () => this.setState({show: true});
    handleSubmit = event => {
        event.preventDefault();
        const { name, description } = this.state;
        if(this.isFormValid(name, description)) {
            this.addChatRoom();
        }

    };

    handleRoomName = event => this.setState({name: event.target.value});

    handleDescription = event => this.setState({description: event.target.value});

    isFormValid = ( name, description) => name && description;

    addChatRoom = async () => {

        const key = this.state.chatRoomsRef.push().key;
        const { name, description } = this.state;
        const { user } = this.props;
        const newChatRoom = {
            id: key,
            name: name,
            description: description,
            createdBy: {
                name: user.displayName,
                image: user.photoURL
            }
        };

        try {
            await this.state.chatRoomsRef.child(key).update(newChatRoom)
            this.setState({
                name: "",
                description: "",
                show: false,
            })
        } catch (error) {
            alert(error);
        }
    }

    changeChatRoom = room => {
        this.props.dispatch(setCurrentChatRoom(room));
        this.props.dispatch(setPrivateChatRoom(false));
        this.setState({activeChatRoomId: room.id});
        this.clearNotifications();
    }

    clearNotifications = () => {
        let index = this.state.notifications.findIndex(
            notification => notification.id === this.props.chatRoom.id
        )

        if(index !== -1) {
            let updatedNotifications = [...this.state.notifications];
            updatedNotifications[index].lastKnownTotal = this.state.notifications[index].total;
            updatedNotifications[index].count = 0;
            this.setState({notifications: updatedNotifications})
        }
    }

    getNotificationCount = room => {
        // 해당 채팅방의 count 수를 구하는 중입니다.
        let count = 0;

        this.state.notifications.forEach(notification => {
            if(notification.id === room.id) {
                count = notification.count;
            }
        })

        if(count > 0) return count;
    }

    renderChatRooms = chatRooms => {
        return chatRooms.length > 0 &&
            chatRooms.map(room => (
                <li
                    key={room.id}
                    onClick={() => this.changeChatRoom(room)}
                    style={{
                        cursor: 'pointer',
                        backgroundColor: room.id === this.state.activeChatRoomId && "#ffffff45"
                    }}
                >
                    # {room.name}
                    <Badge style={{float: 'right', marginTop: '4px'}} variant="red">
                        {this.getNotificationCount(room)}
                    </Badge>
                </li>
            ))
    }

    render() {
        return (
            <div>
                <div style={{position: 'relative', width: '100%', display: 'flex', alignItems: 'center'}}>
                    <FaRegSmileWink style={{marginRight: 3}} />
                    CHAT ROOMS {" "} (1)
                    <FaPlus 
                        style={{position: 'absolute', right: 0, cursor: 'pointer'}}
                        onClick={this.handleShow}
                    />
                </div>

                <ul style={{listStyleType: 'none', padding: 0}}>
                    {this.renderChatRooms(this.state.chatRooms)}
                </ul>
                
                {/* ADD CHAT ROOM MODAL */}

                <Modal show={this.state.show} onHide={this.handleClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>Create a chat room</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form onSubmit={this.handleSubmit}> 
                            <Form.Group controlId="formBasicEmail">
                                <Form.Label>방 이름</Form.Label>
                                <Form.Control 
                                    type="text" 
                                    placeholder="Enter a chat room name" 
                                    onChange={this.handleRoomName}
                                    value={this.state.name}
                                />
                            </Form.Group>
                            <Form.Group controlId="formBasicPassword">
                                <Form.Label>방 설명</Form.Label>
                                <Form.Control 
                                    type="text" 
                                    placeholder="Enter a chat room description" 
                                    onChange={this.handleDescription}
                                    value={this.state.description}
                                />
                            </Form.Group>                            
                        </Form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={this.handleClose}>
                            Close
                        </Button>
                        <Button variant="primary" onClick={this.handleSubmit}>
                            Save Changes
                        </Button>
                    </Modal.Footer>
                </Modal>

            </div>
        )
    }
}


const mspStateToProps = ({user, chatRoom}) => ({
    user: user.currentUser,
    chatRoom: chatRoom.currentChatRoom
})

export default connect(
    mspStateToProps
)(ChatRooms)
