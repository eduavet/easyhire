import React, { Component } from 'react';
import { connect } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import Notifications from 'react-notify-toast';
import PropTypes from 'prop-types';
import Dashboard from './Dashboard.jsx';
import { asyncGetEmails, asyncGetUsername } from '../../redux/reducers/emailsReducer';
import { asyncGetFolders } from '../../redux/reducers/folderReducer';
import Login from './Login.jsx';


export class App extends Component {
  componentWillMount() {
    this.props.getUsername();
    this.props.getEmails();
    this.props.getFolders();
  }

  render() {
    return (
      <BrowserRouter>
        <div className="App">
          <Notifications />
          {
            !this.props.loading ? this.props.username ? <Dashboard /> : <Login /> : ''
          }
        </div>
      </BrowserRouter>
    );
  }
}

App.propTypes = {
  getUsername: PropTypes.func.isRequired,
  getEmails: PropTypes.func.isRequired,
  loading: PropTypes.bool,
  username: PropTypes.string,
  getFolders: PropTypes.func.isRequired,
};

function mapStateToProps(state) {
  return {
    username: state.emails.name,
    loading: state.emails.loading,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    getEmails: () => dispatch(asyncGetEmails()),
    getUsername: () => dispatch(asyncGetUsername()),
    getFolders: () => dispatch(asyncGetFolders()),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(App);
