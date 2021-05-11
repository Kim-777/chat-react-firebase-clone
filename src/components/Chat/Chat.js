import React from 'react';
import SidePanel from './SidePanel/SidePanel';
import MainPanel from './MainPanel/MainPanel';


const Chat = () => {
    return (
        <div style={{display: 'flex'}}>
            <div style={{ width: '300px'}}>
                <SidePanel />
            </div>
            <div style={{ width: '100%'}}>
                <MainPanel />
            </div>
        </div>
    )
};

export default Chat;
