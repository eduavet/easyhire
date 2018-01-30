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
                <Header username={this.props.username}/>
                <div className="container-fluid mt-4">
                    <div className='row'>
                        <Sync />
                        <Toolbar emails={this.props.emails} selectAll={this.props.selectAll} selectNone={this.props.selectNone}/>
                    </div>
                    <div className="row">
                        <Sidebar folders = { this.props.folders } />
                        <Emails emails={ this.props.emails } isChecked={this.props.isChecked}/>
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
