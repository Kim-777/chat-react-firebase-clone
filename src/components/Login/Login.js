import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form';
import firebase from '../../firebase';

const Login = () => {

    const {register, handleSubmit, formState: { errors } } = useForm();

    const [loading, setLoading] = useState(false)
    const [errorFromSubmit, setErrorFromSubmit] = useState("");




    const onSubmit = async data => {
        
        try {
            setLoading(true);

            await firebase.auth().signInWithEmailAndPassword(data.email, data.password);
            console.log('login success');
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
                <h3>Login</h3>
            </div>
            <form onSubmit={handleSubmit(onSubmit)}>
                <label>Email</label>
                <input 
                    name="email" 
                    type="email"
                    {...register("email", { required: true, pattern: /^\S+@\S+$/i })}
                />
                {errors.email && <p>This field is required</p>}

                <label>Password</label>
                <input 
                    name="password"
                    type="password"
                    {...register("password", {required: true, minLength: 8})}
                />
                {errors.password && errors.password.type === "required" && <p>This field is required</p>}
                {errors.password && errors.password.type === "minLength" && <p>Password must have at least 6 characters</p>}

                {errorFromSubmit && <p>{errorFromSubmit}</p>}

                <input type="submit" value="submit" disabled={loading}/>
                <Link to="/register" style={{color: 'gray', textDecoration: "none"}}>아직 아이디가 없다면..</Link>
            </form>
            
        </div>
    )
}

export default Login
