import React, { useRef } from 'react';
import { IoIosChatboxes } from 'react-icons/io';
import Dropdown from 'react-bootstrap/Dropdown';
import firebase from '../../../firebase';
import Image from 'react-bootstrap/Image';
import { useSelector, useDispatch } from 'react-redux';
import mime from 'mime-types';
import {
    setPhotoURL,
} from '../../../redux/actions/user';

const UserPanel = () => {

    const dispatch = useDispatch();
    const inputOpenImageRef = useRef(null);

    const user = useSelector(({user}) => user.currentUser);
    console.log('userPanel', user);

    const handleLogout = () => {
        firebase.auth().signOut();
    };

    const handleOpenImageRef = () => {
        inputOpenImageRef.current.click();
    }

    const handleUploadImage = async event => {
        const file = event.target.files[0];
        const metadata = {contentType: mime.lookup(file.name)};
        
        // storage에 파일 저장하기
        try {
            let uploadTaskSnapshot = await firebase.storage().ref()
                .child(`user_image/${user.uid}`)
                .put(file, metadata);
                
                let downloadURL = await uploadTaskSnapshot.ref.getDownloadURL();
                console.log('downloadURL', downloadURL);

                // 프로필 이미지 수정
                await firebase.auth().currentUser.updateProfile({
                    photoURL: downloadURL
                });

                dispatch(setPhotoURL(downloadURL));

                // 데이터베이스 유저 이미지 수정
                await firebase.database().ref("users")
                    .child(user.uid)
                    .update({ image: downloadURL});
                
                
        } catch (error) {
            console.log('storage error', error);
        }

    };

    return (
        <div>
            {/* Logo */}
            <h3 style={{color: 'white'}}>
                <IoIosChatboxes /> {" "} Chat App
            </h3>

            <div style={{ display: 'flex', marginBottom: '1rem'}}>
                <Image src={user && user.photoURL} 
                        style={{width: '30px', height:'30px', marginTop: '3px'}}
                        roundedCircle
                />

                <Dropdown>
                    <Dropdown.Toggle
                        style={{background: 'transparent', border: '0px'}}
                        id="dropdown-basic"
                    >
                        {user && user.displayName}
                    </Dropdown.Toggle>

                    <Dropdown.Menu>
                        <Dropdown.Item href="#" onClick={handleOpenImageRef}>프로필 사진 변경</Dropdown.Item>
                        <Dropdown.Item href="#" onClick={handleLogout}>로그아웃</Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
            </div>

            <input 
                    type="file"                
                    style={{display:'none'}}
                    accept="image/jpeg, image/png"
                    onChange={handleUploadImage}
                    ref={inputOpenImageRef}
            />

        </div>
    )
};

export default UserPanel;
