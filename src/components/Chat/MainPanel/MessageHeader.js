import React, { useState, useEffect, useCallback } from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Image from "react-bootstrap/Image";
import Accordion from "react-bootstrap/Accordion";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import { FaLock, FaLockOpen } from "react-icons/fa";
import { MdFavorite, MdFavoriteBorder } from "react-icons/md";
import { FormControl, InputGroup, Media } from "react-bootstrap";
import { AiOutlineSearch } from "react-icons/ai";
import { useSelector } from "react-redux";
import firebase from "../../../firebase";

const MessageHeader = ({ handleSearchChange }) => {
    const {currentChatRoom:chatRoom, userPosts } = useSelector(({ chatRoom }) => chatRoom);
    const isPrivateChatRoom = useSelector(
        ({ chatRoom }) => chatRoom.isPrivateChatRoom
    );
    const user = useSelector(({ user }) => user.currentUser);
    const [isFavorited, setIsFavorited] = useState(false);
    const usersRef = firebase.database().ref("users");

    const addFavoriteListener = useCallback(
        (chatRoomId, userId) => {
            usersRef
                .child(userId)
                .child("favorited")
                .once("value")
                .then((data) => {
                    if (data.val()) {
                        const chatRoomIds = Object.keys(data.val());

                        console.log("data.val()", data.val());
                        console.log("chatRoomIds", chatRoomIds);
                        const isAlreadyFavorited = chatRoomIds.includes(chatRoomId)
                        setIsFavorited(isAlreadyFavorited);
                    }
                });
        },
        [usersRef]
    );


    useEffect(() => {
        if (user && chatRoom) {
            addFavoriteListener(chatRoom.id, user.uid);
        }
    }, [user, addFavoriteListener, chatRoom]);

    const handleFavorite = () => {
        if (isFavorited) {
            usersRef
                .child(`${user.uid}/favorited`)
                .child(chatRoom.id)
                .remove((err) => {
                    if (err) {
                        console.error(err);
                    }
                });
            setIsFavorited((prev) => !prev);
        } else {
            usersRef.child(`${user.uid}/favorited`).update({
                [chatRoom.id]: {
                    name: chatRoom.name,
                    description: chatRoom.description,
                    createdBy: {
                        name: chatRoom.createdBy.name,
                        image: chatRoom.createdBy.image,
                    },
                },
            });
            setIsFavorited((prev) => !prev);
        }
    };

    const renderUserPosts = userPosts => (
        Object.entries(userPosts)
            .sort((a, b) => b[1].count - a[1].count)
            .map(([key, val], i) => (
                <Media key={i} style={{display: 'flex'}}>
                    <img 
                        style={{borderRadius: 25, marginRight:'10px'}}
                        width={48}
                        height={48}
                        className="mr-3"
                        src={val.image}
                        alt={val.name}
                    />
                    <Media.Body>
                        <h6>{key}</h6>
                        <p>
                            {val.count}개
                        </p>
                    </Media.Body>
                </Media>
            ))
    )

    return (
        <div
            style={{
                width: "100%",
                height: "170px",
                border: "2px solid #ececec",
                borderRadius: "4px",
                padding: "1rem",
                marginBottom: "1rem",
            }}
        >
            <Container>
                <Row>
                    <Col>
                        {" "}
                        <h4>
                            {isPrivateChatRoom ? (
                                <FaLock style={{ marginBottom: "10px" }} />
                            ) : (
                                <FaLockOpen style={{ marginBottom: "10px" }} />
                            )}
                            {chatRoom && chatRoom.name}

                            {!isPrivateChatRoom && (
                                <span
                                    style={{ cursor: "pointer" }}
                                    onClick={handleFavorite}
                                >
                                    {isFavorited ? (
                                        <MdFavorite
                                            style={{ marginBottom: "10px" }}
                                        />
                                    ) : (
                                        <MdFavoriteBorder
                                            style={{ marginBottom: "10px" }}
                                        />
                                    )}
                                </span>
                            )}
                        </h4>{" "}
                    </Col>
                    <Col>
                        <InputGroup className="mb-3">
                            <InputGroup.Prepend>
                                <InputGroup.Text id="basic-addon1">
                                    <div style={{ height: "100%" }}>
                                        <AiOutlineSearch />
                                    </div>
                                </InputGroup.Text>
                            </InputGroup.Prepend>
                            <FormControl
                                onChange={handleSearchChange}
                                placeholder="Search Message"
                                aria-label="Search"
                                aria-describedby="basic-addon1"
                            />
                        </InputGroup>
                    </Col>
                </Row>
                
                {!isPrivateChatRoom &&
                <div style={{ display: "flex", justifyContent: "flex-end" }}>
                    <p>
                        <Image 
                            src={chatRoom && chatRoom.createdBy.image} 
                            roundedCircle
                            style={{width: '30px', height: '30px'}}
                        />  {" "} {chatRoom && chatRoom.createdBy.name}
                    </p>
                </div>
                }

                <Row>
                    <Col>
                        <Accordion>
                            <Card>
                                <Card.Header style={{ padding: "0 1rem" }}>
                                    <Accordion.Toggle
                                        as={Button}
                                        variant="link"
                                        eventKey="0"
                                    >
                                        Description
                                    </Accordion.Toggle>
                                </Card.Header>
                                <Accordion.Collapse eventKey="0">
                                    <Card.Body>
                                        {chatRoom && chatRoom.description}
                                    </Card.Body>
                                </Accordion.Collapse>
                            </Card>
                        </Accordion>
                    </Col>
                    <Col>
                        <Accordion>
                            <Card>
                                <Card.Header style={{ padding: "0 1rem" }}>
                                    <Accordion.Toggle
                                        as={Button}
                                        variant="link"
                                        eventKey="0"
                                    >
                                        Posts Count
                                    </Accordion.Toggle>
                                </Card.Header>
                                <Accordion.Collapse eventKey="0">
                                    <Card.Body>
                                        {userPosts && renderUserPosts(userPosts)}
                                    </Card.Body>
                                </Accordion.Collapse>
                            </Card>
                        </Accordion>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default MessageHeader;
