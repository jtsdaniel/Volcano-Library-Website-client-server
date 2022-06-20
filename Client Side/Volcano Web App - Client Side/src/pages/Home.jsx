import React from "react";
import { Link } from "react-router-dom";
import { token } from "./Login";
export default function Home(){
    return (
        <main className="Home">
            {homeHero()}
        </main>
    )
}
// hero content
function homeHero() {
  
    return(
        <section className="hero">
            {/* content for the hero */}
            <div className="hero__content">
            <h1 className="hero__title">VOLCANO LIBRARY</h1>
            <p className="hero__subtitle">A Tool to show Volcano's details around the world</p>
            <Link to="/volcanolist">Volcano List</Link>
            {token=='undefined'?<Link to="/register">Register</Link>:null}
            </div>
        </section>
    )
}
   
