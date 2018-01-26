import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link, Route, Switch, BrowserRouter} from 'react-router-dom';
import Header from './Header.jsx'

// import { example } from '../appRedux/reducers/exampleReducer';

const url = 'http://localhost:3000/api/addUser/';



class App extends Component {
    constructor(){
        super();
        this.state = {
            userId :'',
        }
    }
    componentDidMount(){
        window.onSignIn = (googleUser)=> {
            let profile = googleUser.getBasicProfile();

            const newUser = {
                googleID: profile.getId(),
                name: profile.getName(),
                imageURL: profile.getImageUrl(),
                email: profile.getEmail()
            };
            this.setState({userId: profile.getId()});
            fetch(url, {
                method: 'POST',
                body: JSON.stringify(newUser),
                headers: new Headers({
                    'Content-Type': 'application/json'
                })
            })
                .catch(console.error)
        }

    }
    render() {
        return (
            <BrowserRouter>
                <div className="App">
                <Header/>
                        <div className="g-signin2" ref="googleBtn" data-onsuccess="onSignIn"></div>
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
