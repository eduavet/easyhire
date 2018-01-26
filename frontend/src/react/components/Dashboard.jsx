import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link, Route, Switch, BrowserRouter} from 'react-router-dom';
import Header from './Header.jsx'
import Toolbar from './Toolbar.jsx';
import Emails from './Emails.jsx';


class Dashboard extends Component{
    render(){
        return(<BrowserRouter>
            <div>
                <Header/>
                <Toolbar/>
                <Emails/>
            </div>
        </BrowserRouter>)
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
)(Dashboard);