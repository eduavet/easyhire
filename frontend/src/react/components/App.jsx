import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
// import { example } from '../appRedux/reducers/exampleReducer';

const url = 'http://localhost:3000/api/todos/';

class App extends Component {
    render() {
        return (
            <div className="App">
                <h1>Hello World</h1>
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
