import React, { useEffect } from "react";
import { useState } from "react";
import { headUrl } from "../URL";


//token
export let token = localStorage.getItem("token");
export default function Login() {
  const [loginData,setLoginData] = useState({
    email: "",
    password: ""
  });
  const [response, setResponse] = useState([]);
//validate user input
  function validateForm() {
    if (response.error) {
      return(
        <div>
          <h2 className="error_msg">{response.message}</h2>
        </div>
      )
    }
    else if(response.token != undefined)
    {
      return(
      <div>
        <h100>Login Successfully!!!</h100>
        {window.location.href = '/volcanolist'}
      </div>
      )
    }
  }

  function handleSubmit(event) {
    event.preventDefault();
  }

  //Handle to get value from input components 
  function handleChange (e)  {
    setLoginData({
        ...loginData,
        [e.target.name]: e.target.value,
    });
};
//refresh everytime new response
useEffect(()=> {localStorage.setItem("token",response.token)}, [response])

//POST method (to send user's login data)
function postLogin() {
  fetch( `${headUrl}/user/login`, {
    method: 'POST',
    headers: {
      accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      "email": loginData.email,
      "password": loginData.password,
    })
  })
  .then(res => res.json())
  .then(data => setResponse(data))
}
//Hero component for login page's body
function loginHero(){
  return(
    <section className="formHero">
        {/* content for the hero */}
        <h1 className="loginTitle">LOGIN SITE</h1>
        <form onSubmit={handleSubmit}>

          <div className="email_container">
              <label>Email </label>
              <input 
              type="text" 
              name="email" 
              required
              onChange={handleChange} />
            </div>
            <div className="password_container">
              <label>Password </label>
              <input 
              type="password" 
              name="password" 
              required
              onChange={handleChange} />
            </div>

            <button
          className="submit_button"
         type="button"
         onClick={postLogin}>
            SUBMIT
        </button>
        {validateForm()}
      </form>
    </section>
)
}

  return (
    <main className="loginForm">
      {loginHero()}
    </main>
  );
}

