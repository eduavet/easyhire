import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link, Route, Switch, BrowserRouter} from 'react-router-dom';
import Dashboard from './Dashboard.jsx'
import Sidebar from './sidebar.jsx';
import jwt from 'jsonwebtoken';


const url = 'http://localhost:3000/api/addUser/';



class App extends Component {
    constructor(){
        super();
        this.state = {
            emails: [],
        }

    }
    componentWillMount(){
        console.log('didmount')
        console.log('didmount')
        fetch('http://localhost:3000/api/getEmails',{
            credentials: 'include',
        })
            .then(res => {
                return res.json();
            })
            .then(res => {
                this.setState({ emails: res.emailsToSend })
            }).catch(err => {
                console.error(err)
        })
    }

    render() {
        return (
            <BrowserRouter>
                <div className="App">
                    <a href="http://localhost:3000/auth/google">Log in</a>
                <Dashboard emails={this.state.emails}/>
                        {/*<div className="g-signin2" ref="googleBtn" data-onsuccess="onSignIn"></div>*/}
                </div>
            </BrowserRouter>
        );
    }
}

function mapStateToProps(state) {
    return {
        // example: state.example
    };
}

function mapDispatchToProps(dispatch) {
    return {
        // example2: (param) => dispatch(example(param)),
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(App);
