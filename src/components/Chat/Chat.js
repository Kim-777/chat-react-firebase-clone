import React from 'react';
import SidePanel from './SidePanel/SidePanel';
import MainPanel from './MainPanel/MainPanel';
import { useSelector } from 'react-redux';

const Chat = () => {

    const currentChatRoom = useSelector(({ chatRoom }) => chatRoom.currentChatRoom);

    return (
        <div style={{display: 'flex'}}>
            <div style={{ width: '300px'}}>
                <SidePanel />
            </div>
            <div style={{ width: '100%'}}>
                <MainPanel 
                    key={currentChatRoom && currentChatRoom.id}
                />
            </div>
        </div>
    )
};

export default Chat;
