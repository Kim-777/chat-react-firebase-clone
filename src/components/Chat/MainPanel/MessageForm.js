import React, { useState } from "react";
import Form from 'react-bootstrap/Form';
import ProgressBar from 'react-bootstrap/ProgressBar';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import firebase from '../../../firebase';

const MessageForm = () => {

    const [content, setContent] = useState("");
    const [errors, setErrors] = useState([]);
    const [loading, setLoading] = useState(false);

    const messagesRef = firebase.database().ref("messages");

    const handleChange = event => {
        setContent(event.target.value);
    }

    const handleSubmit = async () => {
        if(!content) {
            setErrors(prev => prev.concat("Type contents first"));
            return;
        }
        setLoading(true);

        //firebase에 메시지를 저장하는 부분
        try {
            await messagesRef
        } catch (error) {

        }
    }

    return (
        <div>
            <Form onSubmit={handleSubmit}>
                <Form.Group controlId="exampleForm.ControlTextarea1">
                    <Form.Label>Example textarea</Form.Label>
                    <Form.Control
                        value={content}
                        onChange={handleChange}
                        as="textarea" 
                        rows={3} 
                    />
                </Form.Group>
            </Form>

            <ProgressBar variant="warning" label="60%" now={60} />
            <Row>
                <Col>
                    <button
                        onClick={handleSubmit}
                        className="message-form-button"
                    >
                        SEND
                    </button>
                </Col>
                <Col>
                    <button
                        className="message-form-button"
                    >
                        UPLOAD
                    </button>
                </Col>
            </Row>
        </div>

    );
};

export default MessageForm;
