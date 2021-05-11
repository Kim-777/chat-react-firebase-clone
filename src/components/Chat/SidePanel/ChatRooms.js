import React, { Component } from 'react'
import { FaRegSmileWink } from 'react-icons/fa';
import { FaPlus } from 'react-icons/fa';
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { connect } from 'react-redux';
import firebase from '../../../firebase';
import {
    setCurrentChatRoom,
} from '../../../redux/actions/chatRoom';
export class ChatRooms extends Component {

    state = {
        show: false,
        name: "",
        description: "",
        chatRoomsRef: firebase.database().ref("chatRooms"),
        chatRooms: [],
        firstLoad: true,
        activeChatRoomId: "",
    }

    componentDidMount() {
        this.AddChatRoomsListeners();
    }

    componentWillUnmount() {
        this.state.chatRoomsRef.off();
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
        });
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
        this.setState({activeChatRoomId: room.id});
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


const mspStateToProps = ({user}) => ({
    user: user.currentUser
})

export default connect(
    mspStateToProps
)(ChatRooms)
