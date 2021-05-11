import React from "react";
import Media from 'react-bootstrap/Media';
import moment from 'moment';

const Message = ({ message, user }) => {

    const timeFromNow = timestamp => moment(timestamp).fromNow();

    const isImage = message => {
        return message.hasOwnProperty("image") && !message.hasOwnProperty("content");
    }

    const isMessageMine = (message, user) => {
        return message.user.id === user?.uid
    }

    return (
        <Media style={{display: 'flex', marginBottom: '3px'}}>
            <img
                style={{borderRadius:' 10px'}}
                width={48}
                height={48}
                className="mr-3"
                src={message.user.image}
                alt={message.user.name}
            />
            <Media.Body style={{ backgroundColor: isMessageMine(message, user) && "#ECECEC", flex: 1}}>
                <h6>{message.user.name}
                    {"  "}
                    <span style={{fontSize: '10px', color: 'gray'}}>
                        {timeFromNow(message.timestamp)}
                    </span>
                </h6>
                {isImage(message) ?
                <img style={{ maxWidth: '300px'}} alt="이미지" src={message.image} />
                :
                <p>
                    {message.content}
                </p>
                }

            </Media.Body>
        </Media>
    );
};

export default Message;
