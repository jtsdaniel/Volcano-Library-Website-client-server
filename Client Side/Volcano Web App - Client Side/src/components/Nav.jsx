import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { token } from "../pages/Login";
// navigation links component
export default function Nav() {
  function logOut(){
    localStorage.setItem("token", 'undefined');
    window.location.href = '/';
  }
  return (
    <nav className="navigationBar">
      <ul>
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/volcanolist">Volcano List</Link>
        </li>
        {token=='undefined'?
          <li>
          <Link to="/login">Login</Link>
        </li>:null
        }
        {token=='undefined'?
          <li>
          <Link to="/register">Register</Link>
        </li>:null
        }
        {token!='undefined'?
        // <button onClick={postLogout}> 
        <button onClick={logOut}>
          logout 
        </button>:null}
      </ul>
    </nav>
  );
}
