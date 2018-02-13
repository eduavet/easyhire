import React, { Component } from 'react';
import { Route, BrowserRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { notify } from 'react-notify-toast';
import Header from './Header.jsx';
import Toolbar from './Toolbar.jsx';
import Sidebar from './Sidebar.jsx';
import Emails from './Emails.jsx';
import Refresh from './Refresh.jsx';
import Email from './Email.jsx';
import Compose from './Compose.jsx';
import Settings from './Settings.jsx';

export class Dashboard extends Component {
  componentDidUpdate() {
    // Clear search field when changing folder
  }

  render() {
    return (
      <BrowserRouter>
        <div>
          {this.props.responseMsgs.map((responseMsg) => {
            notify.show(responseMsg.msg, responseMsg.type, 1500);
          })}
          {this.props.errors.map((error) => {
            notify.show(error.msg, 'error', 1500);
          })}
          <Header />
          {
            this.props.page !== 'dashboard' ?
              <Settings />
            :
              <div className="container-fluid mt-4">
                <div className="row">
                  <Refresh />
                  <Toolbar ref="toolbar" />
                </div>
                <div className="row">
                  <Sidebar />
                  <Route exact path="/" component={Emails} />
                  <Route exact path="/email/:id" component={Email} />
                  <Route exact path="/folder/:id" component={Emails} />
                </div>
                <Compose />
              </div>
          }
        </div>
      </BrowserRouter>);
  }
}

Dashboard.propTypes = {
  page: PropTypes.string.isRequired,
  errors: PropTypes.array.isRequired,
  responseMsgs: PropTypes.array.isRequired,
};

function mapStateToProps(state) {
  return {
    page: state.folders.page,
    errors: [...state.email.errors,
      ...state.emails.errors,
      ...state.folders.errors,
      ...state.settings.errors,
      ...state.statuses.errors],
    responseMsgs: [
      ...state.email.responseMsgs,
      ...state.settings.responseMsgs,
      ...state.emails.responseMsgs,
      ...state.folders.responseMsgs,
      ...state.statuses.responseMsgs,
    ],
    folders: state.folders.folders,
  };
}

function mapDispatchToProps() {
  return {};
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Dashboard);
