import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link, Route, Switch, BrowserRouter} from 'react-router-dom';
import Dashboard from './Dashboard.jsx'
import Sidebar from './sidebar.jsx';
import { asyncGetEmails, asyncGetUsername } from '../../redux/reducers/emailsReducer';


const url = 'http://localhost:3000/api/addUser/';



class App extends Component {
    constructor(){
        super();
        this.state = {
            emails: [],
        }

    }
    componentWillMount(){
        this.props.getEmails();
        this.props.getUsername();

    }

    render() {
        return (
            <BrowserRouter>
                <div className="App">
                    <a href="http://localhost:3000/auth/google">Log in</a>
                    <Dashboard emails={this.props.emails} username={this.props.username} folders={ this.props.folders }/>
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

    };
}

function mapDispatchToProps(dispatch) {
    return {
        getEmails: () => dispatch(asyncGetEmails()),
        getUsername: ()=>dispatch(asyncGetUsername())
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(App);
