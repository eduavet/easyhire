import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link, Route, Switch, BrowserRouter} from 'react-router-dom';
import Dashboard from './Dashboard.jsx'
import { asyncGetEmails, asyncGetUsername } from '../../redux/reducers/emailsReducer';
import Login from './Login.jsx'
import Notifications, {notify} from 'react-notify-toast';

export class App extends Component {

  componentWillMount(){
    this.props.getUsername();
    this.props.getEmails();
  }

  render() {
    return (
      <BrowserRouter>
        <div className="App">
          <Notifications />
          {
            !this.props.loading ?
              this.props.username ?
                <Dashboard />
                :
                <Login/>
              :''
          }
        </div>
      </BrowserRouter>
    );
  }
}

function mapStateToProps(state) {
  return {
    username: state.name,
    loading: state.loading
  };
}

function mapDispatchToProps(dispatch) {
  return {
    getEmails: () => dispatch(asyncGetEmails()),
    getUsername: () => dispatch(asyncGetUsername())
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);
