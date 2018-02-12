import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Route, Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Nav, NavItem, Navbar, NavbarBrand, Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import Logout from './Logout.jsx';
import Settings from './Settings.jsx';
import { setSettings } from '../../redux/reducers/folderReducer';


export class Header extends Component {
  constructor(props) {
    super(props)
    this.state = {
      dropdownOpen: false
    };
  }

  toggle = () => {
    this.setState({
      dropdownOpen: !this.state.dropdownOpen
    });
  }

  setSettings = (value) => {
    this.props.setSettings(value);
  }

  render() {
    return (
      <div>
        <Navbar color="faded" light expand="md" className="header navbar-dark">
          <Link to="/" className="nav-link" onClick={() => this.setSettings(false)}>
            <img src="/src/assets/images/logo.png" height="40" className="d-inline-block align-top" />
          </Link>
          <Nav className="ml-auto navbar-nav" navbar>
            <NavItem className="navbar-text text-white">
              Hi {this.props.username}!&nbsp;&nbsp;
            </NavItem>
            <NavItem>
              <Dropdown isOpen={this.state.dropdownOpen} toggle={this.toggle} >
                <DropdownToggle id="settingsbtn">
                  Settings&nbsp;
                  <i className="fas fa-cogs"></i>
                </DropdownToggle>
                <DropdownMenu>
                  <Link to="/settings/statuses" className="nav-link" onClick={() => this.setSettings(true)}>
                    <DropdownItem>Statuses</DropdownItem>
                  </Link>
                  <Link to="/settings/templates" className="nav-link" onClick={() => this.setSettings(true)}>
                    <DropdownItem>Templates</DropdownItem>
                  </Link>
                  <Link to="/settings/signature" className="nav-link" onClick={() => this.setSettings(true)}>
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
};
function mapStateToProps(state) {
  return {
    username: state.emails.name,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    setSettings: value => dispatch(setSettings(dispatch, value)),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Header);
