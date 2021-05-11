import {
    SET_CURRENT_CHATROOM,
    SET_PRIVATE_CHATROOM
} from '../constants/chatRoom';


// initailState
const initialState = {
    currentChatRoom: null,
    isPrivateChatRoom: false,
};


const chatRoom = (state = initialState, action) => {
    switch(action.type) {
        case SET_CURRENT_CHATROOM :
            return {
                ...state,
                currentChatRoom: action.payload,
            };
        case SET_PRIVATE_CHATROOM :
            return {
                ...state,
                isPrivateChatRoom: action.payload,
            }
        default:
            return state;
    }
}

export default chatRoom;