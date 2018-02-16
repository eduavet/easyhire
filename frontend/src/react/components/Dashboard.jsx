import React, { Component } from 'react';
import { Route, BrowserRouter, Switch } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { notify } from 'react-notify-toast';
import Header from './Header.jsx';
import Toolbar from './Toolbar.jsx';
import SentToolbar from './SentToolbar.jsx';
import Sidebar from './Sidebar.jsx';
import Emails from './Emails.jsx';
import SentEmails from './SentEmails.jsx';
import Refresh from './Refresh.jsx';
import Email from './Email.jsx';
import Compose from './Compose.jsx';
import Templates from './Templates.jsx';
import Statuses from './Statuses.jsx';
import ComposeButton from './ComposeButton.jsx';
import { clearError as clearEmailError, clearResponseMsg as clearEmailResponseMsg } from '../../redux/reducers/emailReducer';
import { clearError as clearEmailsError, clearResponseMsg as clearEmailsResponseMsg } from '../../redux/reducers/emailsReducer';
import { clearError as clearFolderError, clearResponseMsg as clearFolderResponseMsg } from '../../redux/reducers/folderReducer';
import { clearError as clearSettingsError, clearResponseMsg as clearSettingsResponseMsg } from '../../redux/reducers/settingsReducer';
import { clearError as clearStatusError, clearResponseMsg as clearStatusResponseMsg } from '../../redux/reducers/statusReducer';


export class Dashboard extends Component {
  componentWillMount() {
    this.props.responseMsgs.forEach((responseMsg, index) => {
      const msgToShow = responseMsg.msg;
      const msgType = responseMsg.type;
      const clearFunctionName = responseMsg.clearFunction;
      const delay = index ? 3000 : 0;
      setTimeout(() => {
        this.showNotifyActionThenDelete(msgToShow, msgType, clearFunctionName);
      }, delay);
    });
    this.props.errors.forEach((error, index) => {
      const msgToShow = error.msg;
      const msgType = 'error';
      const clearFunctionName = error.clearFunction;
      const delay = index ? 3000 : 0;
      setTimeout(() => {
        this.showNotifyActionThenDelete(msgToShow, msgType, clearFunctionName);
      }, delay);
    });
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps === this.props) {
      return;
    }
    if (nextProps.responseMsgs !== this.props.responseMsgs) {
      nextProps.responseMsgs.forEach((responseMsg, index) => {
        const msgToShow = responseMsg.msg;
        const msgType = responseMsg.type;
        const clearFunctionName = responseMsg.clearFunction;
        const delay = index ? 3000 : 0;
        setTimeout(() => {
          this.showNotifyActionThenDelete(msgToShow, msgType, clearFunctionName);
        }, delay);
      });
    }
    if (nextProps.errors !== this.props.errors) {
      nextProps.errors.forEach((error, index) => {
        const msgToShow = error.msg;
        const msgType = 'error';
        const clearFunctionName = error.clearFunction;
        const delay = index ? 3000 : 0;
        setTimeout(() => {
          this.showNotifyActionThenDelete(msgToShow, msgType, clearFunctionName);
        }, delay);
      });
    }
  }
  showNotifyActionThenDelete = (msgToShow, msgType, clearFunctionName) => {
    notify.show(msgToShow, msgType, 1500);
    this.props[clearFunctionName](msgToShow);
  };
  render() {
    return (
      <BrowserRouter>
        <div>
          <Header />
          {
            <div className="container-fluid mt-4">
              <Route exact path="/settings/templates" component={Templates} />
              <Route exact path="/settings/statuses" component={Statuses} />
              <div className="row">
                <Route exact path="/" component={Refresh} />
                <Route exact path="/" component={Toolbar} />
                <Route exact path="/folder/:id" component={Refresh} />
                <Route exact path="/folder/:id" component={Toolbar} />
                <Route exact path="/folder/sent/:id" component={Refresh} />
                <Route exact path="/folder/sent/:id" component={SentToolbar} />
              </div>
              <div className="row">
                <div className="col-2 mt-2">
                  <Route exact path="/" component={ComposeButton} />
                  <Route exact path="/" component={Sidebar} />
                  <Route exact path="/folder/:id" component={ComposeButton} />
                  <Route exact path="/folder/:id" component={Sidebar} />
                  <Route exact path="/email/:id" component={Sidebar} />
                  <Route exact path="/folder/sent/:id" component={ComposeButton} />
                  <Route exact path="/folder/sent/:id" component={Sidebar} />
                </div>
                <Route exact path="/" component={Emails} />
                <Route exact path="/email/:id" component={Email} />
                <Switch>
                  <Route exact path="/folder/sent/:id" component={SentEmails} />
                  <Route exact path="/folder/:id" component={Emails} />
                </Switch>
              </div>
              <Compose />
            </div>
          }
        </div>
      </BrowserRouter>);
  }
}

Dashboard.propTypes = {
  errors: PropTypes.array.isRequired,
  responseMsgs: PropTypes.array.isRequired,
  // all clear functions used in // used in this.props[clearFunctionName](msgToShow);
  // clearFunctionName is variable and can be one of this functions name
  clearEmailError: PropTypes.func.isRequired, // used in this.props[clearFunctionName](msgToShow);
  clearEmailsError: PropTypes.func.isRequired,
  clearFolderError: PropTypes.func.isRequired,
  clearSettingsError: PropTypes.func.isRequired,
  clearStatusError: PropTypes.func.isRequired,
  clearEmailResponseMsg: PropTypes.func.isRequired,
  clearEmailsResponseMsg: PropTypes.func.isRequired,
  clearFolderResponseMsg: PropTypes.func.isRequired,
  clearSettingsResponseMsg: PropTypes.func.isRequired,
  clearStatusResponseMsg: PropTypes.func.isRequired,
};

function mapStateToProps(state) {
  return {
    page: state.folders.page,
    errors: [...state.email.errors,
      ...state.emails.errors,
      ...state.folders.errors,
      ...state.settings.errors,
      ...state.statuses.errors,
    ],
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

function mapDispatchToProps(dispatch) {
  return {
    clearEmailError: error => dispatch(clearEmailError(error)),
    clearEmailsError: error => dispatch(clearEmailsError(error)),
    clearFolderError: error => dispatch(clearFolderError(error)),
    clearSettingsError: error => dispatch(clearSettingsError(error)),
    clearStatusError: error => dispatch(clearStatusError(error)),
    clearEmailResponseMsg: responseMsg => dispatch(clearEmailResponseMsg(responseMsg)),
    clearEmailsResponseMsg: responseMsg => dispatch(clearEmailsResponseMsg(responseMsg)),
    clearFolderResponseMsg: responseMsg => dispatch(clearFolderResponseMsg(responseMsg)),
    clearSettingsResponseMsg: responseMsg => dispatch(clearSettingsResponseMsg(responseMsg)),
    clearStatusResponseMsg: responseMsg => dispatch(clearStatusResponseMsg(responseMsg)),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Dashboard);
