import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link, Route, Switch, BrowserRouter} from 'react-router-dom';
import Dashboard from './Dashboard.jsx'
import Sidebar from './sidebar.jsx';
import { asyncGetEmails, asyncGetUsername } from '../../redux/reducers/emailsReducer';
import Login from './Login.jsx'

const url = 'http://localhost:3000/api/addUser/';



class App extends Component {
    constructor(){
        super();

    }
    componentWillMount(){
        this.props.getUsername();
        this.props.getEmails();
    }

    render() {
        return (
            <BrowserRouter>
                <div className="App">
                    {
                        !this.props.loading?this.props.username?<Dashboard emails={this.props.emails} username={this.props.username} folders={ this.props.folders }/>:<Login/>:''
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
        getUsername: ()=>dispatch(asyncGetUsername())
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(App);
