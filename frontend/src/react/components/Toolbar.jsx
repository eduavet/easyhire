import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link, Route, Switch, BrowserRouter} from 'react-router-dom';

import { Button, Nav, NavItem, Dropdown, DropdownItem, DropdownToggle, DropdownMenu, NavLink, Input, InputGroup, InputGroupAddon } from 'reactstrap';


export default class Toolbar extends Component{

    constructor(props) {
        super(props);
        this.state = {
            selectOpen: false,
            actionOpen: false
        };
    }

    toggleSelect=()=> {
        this.setState({
            selectOpen: !this.state.selectOpen
        });
    }
    toggleAction=()=> {
        this.setState({
            actionOpen: !this.state.actionOpen
        });
    }
    render(){
        return (<div className="col-10">
            <Nav pills>
                <Dropdown nav isOpen={this.state.selectOpen} toggle={this.toggleSelect}>
                    <DropdownToggle nav caret>
                        Select
                    </DropdownToggle>
                    <DropdownMenu>
                        <DropdownItem>
                            <div onClick={ () => console.log('This will fire!') }>Select All</div></DropdownItem>
                        <DropdownItem divider />
                        <DropdownItem>Select none</DropdownItem>
                    </DropdownMenu>
                </Dropdown>

                <Dropdown nav isOpen={this.state.actionOpen} toggle={this.toggleAction}>
                    <DropdownToggle nav caret>
                        Action
                    </DropdownToggle>
                    <DropdownMenu>
                        <DropdownItem>
                            <div onClick={ () => console.log('This will fire!') }>Move to Approved</div></DropdownItem>
                        <DropdownItem divider />
                        <DropdownItem>Move to Rejected</DropdownItem>
                    </DropdownMenu>
                </Dropdown>
                <NavItem>
                    <NavLink href="#"><i className="fas fa-trash-alt"></i></NavLink>
                </NavItem>
                <NavItem className="searchContainer">
                    <form className="my-2 my-lg-0">
                        <div className="inner-addon left-addon">
                            <i className="fa fa-search"></i>
                            <Input className="form-control mr-lg-2" type="search" placeholder="Search" aria-label="Search"></Input>
                        </div>
                    </form>
                </NavItem>
            </Nav>
        </div>)
    }
}