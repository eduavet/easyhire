import React, { Component } from 'react';

export default function Header(props){
        return(
            <header className="header">
                <nav className="navbar navbar-expand-lg navbar-dark">
                    <a className="navbar-brand" href="#">
                        <img src="/src/assets/images/logo.png" width="40" height="40" className="d-inline-block align-top" alt=""/>
                        easyhire
                    </a>
                    <div className="collapse navbar-collapse  ml-avto" id="navbarText">

                        <ul className="navbar-nav ml-auto">
                            <li className="nav-item active"><span className="navbar-text text-white">
                                Hi username!
                            </span></li>
                            <li className="nav-item active">
                                <a className="nav-link" href="#">Settings</a>
                            </li>
                            <li className="nav-item active">
                                <a className="nav-link" href="#">Logout</a>
                            </li>
                        </ul>
                    </div>
                </nav>
            </header>
        );
};