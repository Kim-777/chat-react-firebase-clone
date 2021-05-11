import {
    SET_CURRENT_CHATROOM,
} from '../constants/chatRoom';


// initailState
const initialState = {
    currentChatRoom: null,
};


const chatRoom = (state = initialState, action) => {
    switch(action.type) {
        case SET_CURRENT_CHATROOM :
            return {
                ...state,
                currentChatRoom: action.payload,
            }
        default:
            return state;
    }
}

export default chatRoom;