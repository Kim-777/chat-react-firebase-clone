import {
    SET_CURRENT_CHATROOM,
    SET_PRIVATE_CHATROOM,
    SET_USER_POSTS,
} from '../constants/chatRoom';


export const setCurrentChatRoom = room => ({
    type: SET_CURRENT_CHATROOM,
    payload: room,
});

export const setPrivateChatRoom = isPrivate => ({
    type: SET_PRIVATE_CHATROOM,
    payload: isPrivate,
})


export const setUserPosts = userPosts => ({
    type: SET_USER_POSTS,
    payload: userPosts
})
