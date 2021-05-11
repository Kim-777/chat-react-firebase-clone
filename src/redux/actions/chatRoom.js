import {
    SET_CURRENT_CHATROOM,
} from '../constants/chatRoom';


export const setCurrentChatRoom = room => ({
    type: SET_CURRENT_CHATROOM,
    payload: room,
})

