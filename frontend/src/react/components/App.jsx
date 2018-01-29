import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link, Route, Switch, BrowserRouter} from 'react-router-dom';
import Dashboard from './Dashboard.jsx'
import Sidebar from './sidebar.jsx';
import jwt from 'jsonwebtoken';
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

        // fetch('http://localhost:3000/api/getEmails',{
        //     credentials: 'include',
        // })
        //     .then(res => {
        //         return res.json();
        //     })
        //     .then(res => {
        //         this.setState({ emails: res.emailsToSend })
        //     }).catch(err => {
        //         console.error(err)
        // })
    }

    render() {
        return (
            <BrowserRouter>
                <div className="App">
                    <a href="http://localhost:3000/auth/google">Log in</a>
                <Dashboard emails={this.props.emails} username={this.props.username}/>
                        {/*<div className="g-signin2" ref="googleBtn" data-onsuccess="onSignIn"></div>*/}
                </div>
            </BrowserRouter>
        );
    }
}

function mapStateToProps(state) {
    return {
        emails: state.emails,
        username: state.name
    };
}

function mapDispatchToProps(dispatch) {
    return {
        getEmails: () => dispatch(asyncGetEmails()),
        getUsername: ()=>dispatch(asyncGetUsername())
        // example2: (param) => dispatch(example(param)),
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(App);
