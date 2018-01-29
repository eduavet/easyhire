import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link, Route, Switch, BrowserRouter} from 'react-router-dom';
import Header from './Header.jsx'
import Toolbar from './Toolbar.jsx';
import Sidebar from './sidebar.jsx';
import Emails from './Emails.jsx';
import Sync from './Sync.jsx';


class Dashboard extends Component{
    render(){
        return(<BrowserRouter>
            <div>
                <Header/>
                <div className="container-fluid mt-4">
                    <div className='row'>
                        <Sync />
                        <Toolbar/>
                    </div>
                    <div className="row">
                        <Sidebar />
                        <Emails emails={ this.props.emails }/>
                    </div>
                </div>
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