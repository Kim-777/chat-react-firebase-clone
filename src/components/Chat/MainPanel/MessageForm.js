import React, { useState, useRef } from "react";
import Form from 'react-bootstrap/Form';
import ProgressBar from 'react-bootstrap/ProgressBar';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import firebase from '../../../firebase';
import { useSelector } from 'react-redux';
import mime from 'mime-types';

const MessageForm = () => {

    const [content, setContent] = useState("");
    const [errors, setErrors] = useState([]);
    const [loading, setLoading] = useState(false);
    const [percentage, setPercentage] = useState(0);

    const chatRoom = useSelector(({chatRoom}) => chatRoom.currentChatRoom);
    const user = useSelector(({user}) => user.currentUser)
    const messagesRef = firebase.database().ref("messages");
    const inputOpenImageRef = useRef();
    const storageRef = firebase.storage().ref();
    const handleChange = event => {
        setContent(event.target.value);
    };

    const createMessage = (fileUrl = null) => {
        const message = {
            timestamp: firebase.database.ServerValue.TIMESTAMP,
            user: {
                id: user.uid,
                name: user.displayName,
                image: user.photoURL
            }
        }

        if(fileUrl !== null) {
            message["image"] = fileUrl;
        } else {
            message["content"] = content
        }

        return message;
    }

    const handleSubmit = async () => {
        if(!content) {
            setErrors(prev => prev.concat("Type contents first"));
            return;
        }
        setLoading(true);

        //firebase에 메시지를 저장하는 부분
        try {
            await messagesRef.child(chatRoom.id).push().set(createMessage());
            setLoading(false);
            setContent("");
            setErrors([]);
        } catch (error) {
            setErrors(prevErrors => prevErrors.concat(error.message));
            setLoading(false);
            setTimeout(() => {
                setErrors([]);
            }, 3000);
        }
    }

    const handleOpenImageRef = () => {
        inputOpenImageRef.current.click();
    };

    const handleUploadImage = async event => {
        const file = event.target.files[0];

        const filePath = `/message/public/${file.name}`;
        const metadata = { contentType: mime.lookup(file.name)};
        setLoading(true);

        try {
            //파일을 먼저 스토리지에 저장
            let uploadTask = storageRef.child(filePath).put(file, metadata);

            //파일 저장되는 퍼센티지 구하기
            uploadTask.on(
                "state_changed", 
                UploadTaskSnapshot => {
                    const percentage = Math.round(
                        (UploadTaskSnapshot.bytesTransferred / UploadTaskSnapshot.totalBytes) * 100
                    );
                    setPercentage(percentage);
                },
                err => {
                    console.log.error(err);
                    setLoading(true);
                },
                () => {
                    // 저장이 다 된 후에 파일 메시지 전송 (데이터베이스에 저장)
                    // 저장된 파일을 다운로드 받을 수 있는 URL 가져오기
                    uploadTask.snapshot.ref.getDownloadURL()
                        .then(downloadURL => {
                            console.log('downloadURL', downloadURL);
                            messagesRef.child(chatRoom.id).push().set(createMessage(downloadURL));
                            setLoading(false);
                        })
                }
            );
        } catch (error) {
            alert(error);
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

            {
                !(percentage === 0 || percentage === 100) &&
                <ProgressBar variant="warning" label={`${percentage}%`} now={percentage} />
            }
            <div>
                {errors.map(errorMessage => <p style={{ color: 'red'}} key={errorMessage}>{errorMessage}</p>)}
            </div>
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
                        onClick={handleOpenImageRef}
                        disabled={loading ? true : false}
                    >
                        UPLOAD
                    </button>
                </Col>
            </Row>

            <input
                accept="image/jpeg, image/png"
                style={{display: 'none'}}
                type="file"
                ref={inputOpenImageRef}
                onChange={handleUploadImage}
                disabled={loading ? true : false}
            />

        </div>

    );
};

export default MessageForm;
