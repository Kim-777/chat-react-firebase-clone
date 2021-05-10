import React, { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form';
import firebase from '../../firebase';
import md5 from 'md5';

const Register = () => {

    const {register, handleSubmit, watch, formState: { errors } } = useForm();
    const password = useRef();
    const [loading, setLoading] = useState(false)
    const [errorFromSubmit, setErrorFromSubmit] = useState("");

    password.current = watch("password");

    console.log('password.current', password.current);

    const onSubmit = async data => {
        
        try {
            setLoading(true)
            let createdUser = await firebase.auth().createUserWithEmailAndPassword(data.email, data.password);
            console.log('createdUser', createdUser);

            await createdUser.user.updateProfile({
                displayName: data.name,
                photoURL: `http://gravatar.com/avatar/${md5(createdUser.user.email)}?d=identicon`
            });

            //Firebase 데이터베이스에 저장해주기
            await firebase.database().ref("users").child(createdUser.user.uid).set({
                name: createdUser.user.displayName,
                image: createdUser.user.photoURL,
            });


            setLoading(false);
        } catch (error) {
            console.log(error)
            setErrorFromSubmit(error.message);
            setTimeout(() => {
                setErrorFromSubmit("")
            }, 3000);
            setLoading(false);
        }


    }

    return (
        <div className="auth-wrapper">
            <div style={{textAlign: 'center'}}>
                <h3>Register</h3>
            </div>
            <form onSubmit={handleSubmit(onSubmit)}>
                <label>Email</label>
                <input 
                    name="email" 
                    type="email"
                    {...register("email", { required: true, pattern: /^\S+@\S+$/i })}
                />
                {errors.email && <p>This field is required</p>}

                <label>Name</label>
                <input 
                    name="name"
                    type="text" 
                    {...register("name", {required: true, maxLength: 10})}
                />
                {errors.name && errors.name.type === "required" && <p>This field is required</p>}
                {errors.name && errors.name.type === "maxLength" && <p>Your input exceed maximum length</p>}

                <label>Password</label>
                <input 
                    name="password"
                    type="password"
                    {...register("password", {required: true, minLength: 8})}
                />
                {errors.password && errors.password.type === "required" && <p>This field is required</p>}
                {errors.password && errors.password.type === "minLength" && <p>Password must have at least 6 characters</p>}

                <label>Password Confirm</label>
                <input 
                    name="passwordConfirm"
                    type="password"
                    {...register("passwordConfirm", {required: true, validate: value => value === password.current})}
                />
                {errors.passwordConfirm && errors.passwordConfirm.type === "required" && <p>This field is required</p>}
                {errors.passwordConfirm && errors.passwordConfirm.type === "validate" && <p>Password is not Same</p>}

                {errorFromSubmit && <p>{errorFromSubmit}</p>}

                <input type="submit" value="submit" disabled={loading}/>
                <Link to="/login" style={{color: 'gray', textDecoration: "none"}}>이미 아이디가 있다면..</Link>
            </form>
            
        </div>
    )
}

export default Register
