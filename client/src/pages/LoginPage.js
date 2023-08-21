// import { response } from "express";
import { useContext, useState } from "react";
import { Navigate } from "react-router-dom";
import { UserContext } from "../UserContext";

export default function LoginPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [redirect, setRedirect] = useState(false);
    const {setUserInfo} = useContext(UserContext);

    async function login(ev) {
        ev.preventDefault();
        const response = await fetch('http://localhost:4000/login', {
            //saving things for sessions
            method: 'POST',
            body: JSON.stringify({username, password}),
            headers: {'Content-Type': 'application/json'},
            credentials: 'include',  //cookie will be included to users browser 
        });
        if (response.ok) {  //if response.ok is true then let user log-in then set context information and display username and logout instead of sign-in and register.
            response.json().then(userInfo => {  //we get user info from json.
                setUserInfo(userInfo);
                setRedirect(true);
            });
        }
        else {  //if username and password does not match
            alert('wrong credentials');
        }
    }

    if (redirect) {
        return <Navigate to={'/'} /> //if response.ok is true then redirect to home page i.e if username and password is correct then login.
    }
    

    return (
        <form className="login" onSubmit={login}>
            <h1>Login</h1>
            <input type="text" 
                placeholder="username" 
                value={username} 
                onChange={ev => setUsername(ev.target.value)}/>
            <input type="password" 
                placeholder="password" 
                value={password} 
                onChange={ev => setPassword(ev.target.value)}/>
            <button>Login</button>
        </form>
    );
}