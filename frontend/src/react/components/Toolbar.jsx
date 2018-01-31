import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link, Route, Switch, BrowserRouter} from 'react-router-dom';
import { selectAll, selectNone, asyncPostEmailsToFolder } from '../../redux/reducers/emailsReducer';
import { Button, Nav, NavItem, Dropdown, DropdownItem, DropdownToggle, DropdownMenu, NavLink, Input, InputGroup, InputGroupAddon } from 'reactstrap';

class Toolbar extends Component{
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
    };

    toggleAction=()=> {
        this.setState({
            actionOpen: !this.state.actionOpen
        });
    };

    moveToFolder=(id)=>{
        const emailsToMove = this.props.emails.filter(email=>email.isChecked).map(email=>email.emailID);
        this.props.postEmailsToFolder(emailsToMove, id)
    }



    render(){
        return (<div className="col-10">
            <Nav pills className="toolbar">
                <Dropdown nav isOpen={this.state.selectOpen} toggle={this.toggleSelect}>
                    <DropdownToggle className="selectbtn" nav caret >
                        Select
                    </DropdownToggle>
                    <DropdownMenu>
                        <DropdownItem>
                            <div onClick={ () => this.props.selectAll(this.props.emails) }>Select All</div>
                        </DropdownItem>
                        <DropdownItem divider />
                        <DropdownItem>
                            <div onClick={ () => this.props.selectNone(this.props.emails) }> Select none</div>
                        </DropdownItem>
                    </DropdownMenu>
                </Dropdown>

                <Dropdown nav isOpen={this.state.actionOpen} toggle={this.toggleAction}>
                    <DropdownToggle className="actionbtn" nav caret>
                        Action
                    </DropdownToggle>
                    <DropdownMenu>
                        {
                            this.props.folders.map(folder => {
                                return <DropdownItem key={folder.id}>
                                    <div onClick={ () => this.moveToFolder(folder.id) }>Move to {folder.name}</div>
                                </DropdownItem>
                            })
                        }
                    </DropdownMenu>

                </Dropdown>
                <NavItem>
                    <NavLink href="#"><i className="fas fa-trash-alt"></i></NavLink>
                </NavItem>
                <NavItem className="searchContainer">
                    <form className="my-2 my-lg-0">
                        <div className="inner-addon left-addon">
                            <i className="fa fa-search search-icon"></i>
                            <Input className="form-control mr-lg-2" type="search" placeholder="Search" aria-label="Search"></Input>
                        </div>
                    </form>
                </NavItem>
            </Nav>
        </div>)
    }
}

function mapStateToProps(state) {
  return {
    emails: state.emails,
    folders: state.folders,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    selectAll: (emails) => dispatch(selectAll(emails)),
    selectNone: (emails) => dispatch(selectNone(emails)),
    postEmailsToFolder: (emailIds, folderId) => dispatch(asyncPostEmailsToFolder(emailIds, folderId))
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Toolbar);
