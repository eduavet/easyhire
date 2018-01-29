import React, { Component } from 'react';
import Logout from './Logout.jsx';
import Settings from './Settings.jsx'
import { Link, Route, Switch, BrowserRouter} from 'react-router-dom';
import { Button, Nav, NavItem, Dropdown, DropdownItem, DropdownToggle, DropdownMenu, NavLink, Input, Navbar, NavbarBrand } from 'reactstrap';

export default class Header extends Component{

    render() {
        return (<div>
                <Navbar color="faded" light expand="md" className="header navbar-dark">
                    <NavbarBrand href="/">
                        <img src="/src/assets/images/logo.png" width="60" height="40" className="d-inline-block align-top" alt=""/>
                        easyhire
                    </NavbarBrand>
                        <Nav className="ml-auto navbar-nav" navbar>
                            <NavItem  className="navbar-text text-white">
                                    Hi {this.props.username}!
                            </NavItem>
                            <NavItem>
                                <Link to="/settings" className="nav-link">
                                        <i className="fas fa-cogs settingsbtn"></i>
                                </Link>
                            </NavItem>
                            <NavItem className="active">
                                <Logout/>
                            </NavItem>
                        </Nav>
                </Navbar>
                <Route path="/settings" component={Settings}/>
            </div>
        );
    }
};