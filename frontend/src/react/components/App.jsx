import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
// import { example } from '../appRedux/reducers/exampleReducer';

const url = 'http://localhost:3000/api/addUser/';



class App extends Component {

  componentDidMount(){
    window.onSignIn = function(googleUser) {
      var profile = googleUser.getBasicProfile();

      const newUser = {
        googleID: profile.getId(),
        name: profile.getName(),
        imageURL: profile.getImageUrl(),
        email: profile.getEmail()
      }

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
            <div className="App">
                <h1>Hello World</h1>
                <div class="g-signin2" ref="googleBtn" data-onsuccess="onSignIn"></div>
            </div>
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
