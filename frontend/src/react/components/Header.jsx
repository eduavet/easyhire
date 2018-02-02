import React from 'react';
import { connect } from 'react-redux';
import { Route, Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Nav, NavItem, Navbar, NavbarBrand } from 'reactstrap';
import Logout from './Logout.jsx';
import Settings from './Settings.jsx';


function Header(props) {
  return (
    <div>
      <Navbar color="faded" light expand="md" className="header navbar-dark">
        <NavbarBrand href="/">
          <img src="/src/assets/images/logo.png" height="40" className="d-inline-block align-top" alt="" />
        </NavbarBrand>
        <Nav className="ml-auto navbar-nav" navbar>
          <NavItem className="navbar-text text-white">
            Hi {props.username}!
          </NavItem>
          <NavItem>
            <Link to="/settings" className="nav-link">
              <i className="fas fa-cogs settingsbtn" />
            </Link>
          </NavItem>
          <NavItem className="active">
            <Logout />
          </NavItem>
        </Nav>
      </Navbar>
      <Route path="/settings" component={Settings} />
    </div>
  );
}

Header.propTypes = {
  username: PropTypes.string.isRequired,
};
function mapStateToProps(state) {
  return {
    username: state.name,
  };
}

function mapDispatchToProps() {
  return {};
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Header);
