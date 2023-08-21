// import { response } from "express";
import { useEffect, useContext, useState } from "react";
import {Link} from "react-router-dom";
import {UserContext} from "./UserContext";

export default function Header() {
  const {setUserInfo,userInfo} = useContext(UserContext); //defining setUserInfo,userInfo and using context
  useEffect(() => {
    fetch('http://localhost:4000/profile', {
      credentials: 'include',  
    }).then(response => {
      response.json().then(userInfo => {  //parsing json here
        setUserInfo(userInfo); //if user exisits and credentials match then display username on the page.
      });  //we can do await or .then
    });
  }, []);


  function logout() {
    fetch('http://localhost:4000/logout', {
      credentials: 'include',
      method: 'POST',
    });
    setUserInfo(null);
  }

  const username = userInfo?.username;

    return (
        <header>
        <Link to="/" className="logo">Blogging App by Dhruvang</Link>
        <nav>
          {username && (
            <>
              {/* if we have username then give link to create a new article. */}
              <span>Hello, {username}</span>
              <Link to="/create">Create new post</Link>
              <a onClick={logout}>Logout </a>
            </>
          )}
          {!username && (
            <>
              {/* if we do not have username then give option to Login and register */}
              <Link to="/login" className="">Login</Link>
              <Link to="/register" className="">Register</Link>
            </>
          )}
          
        </nav>
      </header>
    );
}