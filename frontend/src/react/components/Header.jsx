import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Route, Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Nav, NavItem, Navbar, Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import Logout from './Logout.jsx';
import Settings from './Settings.jsx';
import { setPage } from '../../redux/reducers/folderReducer';


export class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dropdownOpen: false,
    };
  }

  setPage = (value) => {
    this.props.setPage(value);
  }

  toggle = () => {
    this.setState({
      dropdownOpen: !this.state.dropdownOpen,
    });
  }


  render() {
    return (
      <div>
        <Navbar color="faded" light expand="md" className="header navbar-dark">
          <Link to="/" className="nav-link" onClick={() => this.setPage('dashboard')}>
            <img src="/src/assets/images/logo.png" height="40" className="d-inline-block align-top" alt="" />
          </Link>
          <Nav className="ml-auto navbar-nav" navbar>
            <NavItem className="navbar-text text-white">
              Hi {this.props.username}!&nbsp;&nbsp;
            </NavItem>
            <NavItem>
              <Dropdown isOpen={this.state.dropdownOpen} toggle={this.toggle} >
                <DropdownToggle id="settingsbtn">
                  Settings&nbsp;
                  <i className="fas fa-cogs" />
                </DropdownToggle>
                <DropdownMenu>
                  <Link to="/settings/statuses" className="nav-link" onClick={() => this.setPage('statuses')}>
                    <DropdownItem>Statuses</DropdownItem>
                  </Link>
                  <Link to="/settings/templates" className="nav-link" onClick={() => this.setPage('templates')}>
                    <DropdownItem>Templates</DropdownItem>
                  </Link>
                  <Link to="/settings/signature" className="nav-link" onClick={() => this.setPage('signature')}>
                    <DropdownItem>Signature</DropdownItem>
                  </Link>
                </DropdownMenu>
              </Dropdown>
            </NavItem>
            <NavItem className="active">
              <Logout />
            </NavItem>
          </Nav>
        </Navbar>
        <Route path="/settings/statuses" component={Settings} />
      </div>
    );
  }
}

Header.propTypes = {
  username: PropTypes.string.isRequired,
  setPage: PropTypes.func.isRequired,
};

function mapStateToProps(state) {
  return {
    username: state.emails.name,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    setPage: value => dispatch(setPage(dispatch, value)),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Header);
