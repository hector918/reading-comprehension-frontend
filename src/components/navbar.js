import React from "react";
import { Link } from "react-router-dom";
import './navbar.css';

export default function NavBar(){
  return(
    <nav className="navbar navbar-c" role="navigation" aria-label="main navigation">
      <div className="navbar-brand">
        <Link className="navbar-logo" to={"/about"}>
          <img src="./logo.png" width="48" height="48" alt="Logo"/>
          <span>Binary Mind</span>
        </Link>

        <Link role="button" className="navbar-burger" aria-label="menu" aria-expanded="false" data-target="navbarBasicExample">
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
        </Link>
      </div>

      <div id="navbarBasicExample" className="navbar-menu">
        {/* <div className="navbar-start">
          <Link className="navbar-item">
            Home
          </Link>

          <Link className="navbar-item">
            Documentation
          </Link>

          <div className="navbar-item has-dropdown is-hoverable">
            <Link className="navbar-link">
              More
            </Link>

            <div className="navbar-dropdown">
              <Link className="navbar-item">
                About
              </Link>
              <Link className="navbar-item">
                Jobs
              </Link>
              <Link className="navbar-item">
                Contact
              </Link>
              <hr className="navbar-divider"/>
              <Link className="navbar-item">
                Report an issue
              </Link>
            </div>
          </div>
        </div> */}

        <div className="navbar-end">
          {/* <div className="navbar-item">
            <div className="buttons">
              <Link className="button is-primary">
                <strong>Sign up</strong>
              </Link>
              <Link className="button is-light">
                Log in
              </Link>
            </div>
          </div> */}
          <Link className="navbar-item custom_text_shadow">
              About
          </Link>
          <Link className="navbar-item custom_text_shadow">
              Sign Up
          </Link>
        </div>
      </div>
    </nav>)
}