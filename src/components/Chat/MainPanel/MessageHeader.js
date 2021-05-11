import React from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Image from "react-bootstrap/Image";
import Accordion from 'react-bootstrap/Accordion';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import { FaLock, FaLockOpen } from "react-icons/fa";
import { MdFavorite } from "react-icons/md";
import { FormControl, InputGroup } from "react-bootstrap";
import { AiOutlineSearch } from "react-icons/ai";
import { useSelector } from 'react-redux';

const MessageHeader = ({ handleSearchChange }) => {

    const chatRoom = useSelector(({chatRoom}) => chatRoom.currentChatRoom);
    const isPrivateChatRoom = useSelector(({chatRoom}) => chatRoom.isPrivateChatRoom);
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
                            {isPrivateChatRoom ?
                            <FaLock style={{marginBottom: '10px'}}/>
                            :
                            <FaLockOpen style={{marginBottom: '10px'}}/>
                            }
                            {chatRoom && chatRoom.name} 
                            <MdFavorite />
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
                <div style={{ display: "flex", justifyContent: "flex-end" }}>
                    <p>
                        <Image src="" /> user name
                    </p>
                </div>
                <Row>
                    <Col>
                        <Accordion>
                            <Card>
                                <Card.Header style={{ padding:'0 1rem'}}>
                                    <Accordion.Toggle
                                        as={Button}
                                        variant="link"
                                        eventKey="0"
                                    >
                                        Description
                                    </Accordion.Toggle>
                                </Card.Header>
                                <Accordion.Collapse eventKey="0">
                                    <Card.Body>Description</Card.Body>
                                </Accordion.Collapse>
                            </Card>
                        </Accordion>
                    </Col>
                    <Col>
                        <Accordion>
                            <Card>
                                <Card.Header style={{ padding:'0 1rem'}}>
                                    <Accordion.Toggle
                                        as={Button}
                                        variant="link"
                                        eventKey="0"
                                    >
                                        Posts Count
                                    </Accordion.Toggle>
                                </Card.Header>
                                <Accordion.Collapse eventKey="0">
                                    <Card.Body>Posts Count</Card.Body>
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
