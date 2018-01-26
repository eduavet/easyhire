import React, { Component } from 'react';
import Logout from './Logout.jsx';
import Settings from './Settings.jsx'
import { Link, Route, Switch, BrowserRouter} from 'react-router-dom';


export default class Header extends Component{

    render() {
        return (<div>
            <header className="header">
                <nav className="navbar navbar-expand-lg navbar-dark">
                    <a className="navbar-brand" href="#">
                        <img src="/src/assets/images/logo.png" width="40" height="40"
                             className="d-inline-block align-top" alt=""/>
                        easyhire
                    </a>
                    <div className="collapse navbar-collapse  ml-avto" id="navbarText">

                        <ul className="navbar-nav ml-auto">
                            <li className="nav-item active">
                                <span className="navbar-text text-white">
                                    Hi username!
                                </span>
                            </li>
                            <li className="nav-item active"><Link to="/settings">
                                <a className="nav-link" href="#"><i className="fas fa-cogs"></i></a></Link>
                            </li>
                            <li className="nav-item active">
                                <Logout/>
                            </li>
                        </ul>

                    </div>
                </nav>
            </header>
                <Route path="/settings" component={Settings}/>
            </div>
        );
    }
};