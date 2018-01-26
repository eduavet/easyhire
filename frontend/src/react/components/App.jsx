import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link, Route, Switch, BrowserRouter} from 'react-router-dom';
import Dashboard from './Dashboard.jsx'


const url = 'http://localhost:3000/api/addUser/';



class App extends Component {
    constructor(){
        super();

    }
    componentDidMount(){


    }
    render() {
        return (
            <BrowserRouter>
                <div className="App">
                <Dashboard/>
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
