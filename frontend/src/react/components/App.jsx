import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link, Route, Switch, BrowserRouter} from 'react-router-dom';
import Dashboard from './Dashboard.jsx'
import Sidebar from './sidebar.jsx';
import { asyncGetEmails, asyncGetUsername, asyncCreateFolder, asyncUpdateFolder, asyncDeleteFolder, isChecked, selectAll, selectNone } from '../../redux/reducers/emailsReducer';
import Login from './Login.jsx'

const url = 'http://localhost:3000/api/addUser/';


class App extends Component {

  componentWillMount(){
    this.props.getUsername();
    this.props.getEmails();
  }

  render() {
    return (
      <BrowserRouter>
        <div className="App">
          {
            !this.props.loading ?
              this.props.username ?
                <Dashboard emails={this.props.emails} username={this.props.username} selectNone={this.props.selectNone} selectAll={this.props.selectAll} isChecked={this.props.isChecked} folders={ this.props.folders }/>
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
    emails: state.emails,
    username: state.name,
    folders: state.folders,
    loading: state.loading,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    getEmails: () => dispatch(asyncGetEmails()),
    getUsername: ()=>dispatch(asyncGetUsername()),
    isChecked: (bool, item)=>dispatch(isChecked(bool, item)),
    selectAll: (emails)=>dispatch(selectAll(emails)),
    selectNone: (emails)=>dispatch(selectNone(emails)),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);
