import React, { Component } from 'react';
import { connect } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import Notifications from 'react-notify-toast';
import PropTypes from 'prop-types';
import Dashboard from './Dashboard.jsx';
import { asyncGetEmails, asyncGetUsername } from '../../redux/reducers/emailsReducer';
import { asyncGetFolders, updateCount } from '../../redux/reducers/folderReducer';
import { asyncGetStatuses } from '../../redux/reducers/statusReducer';
import Login from './Login.jsx';


export class App extends Component {
  componentWillMount() {
    this.props.getUsername();
    this.props.getEmails();
    this.props.getFolders();
    this.props.getStatuses();
  }
  // componentWillReceiveProps(nextProps) {
  //   if (this.props.emails !== nextProps.emails) {
  //     this.props.updateCount();
  //   }
  // }
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
  getStatuses: PropTypes.func.isRequired,
  emails: PropTypes.array,
  updateCount: PropTypes.func,
};

function mapStateToProps(state) {
  return {
    username: state.emails.name,
    loading: state.emails.loading,
    loaded: state.emails.loaded,
    emails: state.emails.emails,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    getEmails: () => dispatch(asyncGetEmails()),
    getUsername: () => dispatch(asyncGetUsername()),
    getFolders: () => dispatch(asyncGetFolders()),
    getStatuses: () => dispatch(asyncGetStatuses()),
    updateCount: () => dispatch(updateCount()),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(App);
