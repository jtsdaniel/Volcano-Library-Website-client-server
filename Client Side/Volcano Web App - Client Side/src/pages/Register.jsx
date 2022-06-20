import React from "react";
import { useState } from "react";
import { headUrl } from "../URL";


export default function Register() {
  const [registerData, setRegisterData] = useState([]);
  const [response, setResponse] = useState([]);

  //validate
  function validateForm() {
    if (response.error) {
      return (
        <div>
          <h5 className="error_msg">{response.message}</h5>
        </div>
      );
    } else if (response.message == "User created") {
      return (
        <div>
          <h5> Register Successfully!</h5>
          {(window.location.href = "/login")}
        </div>
      );
    }
  }

  //Handle to get value from input components
  function handleChange(e) {
    setRegisterData({
      ...registerData,
      [e.target.name]: e.target.value,
    });
  }

  function handleSubmit(event) {
    event.preventDefault();
  }
  //post register request with register's input data
  function postRegister() {
    fetch(`${headUrl}/user/register`, {
      method: "POST",
      headers: {
        accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: registerData.email,
        password: registerData.password,
      }),
    })
      .then((res) => res.json())
      .then((data) => setResponse(data));
  }

  //Hero component for register page's body
  function registerHero() {
    return (
      <section className="formHero">
        <div className="loginForm">
          <h1>REGISTER SITE</h1>
          <form onSubmit={handleSubmit}>
            <div className="email_container">
              <label>Email </label>
              <input
                type="text"
                name="email"
                required
                onChange={handleChange}
              />
            </div>

            <div className="password_container">
              <label>Password </label>
              <input
                type="password"
                name="password"
                required
                onChange={handleChange}
              />
            </div>

            <button
              className="submit_button"
              type="button"
              onClick={postRegister}
            >
              SUBMIT
            </button>
            {validateForm()}
          </form>
        </div>
      </section>
    );
  }
  return <main className="registerForm">{registerHero()}</main>;
}
