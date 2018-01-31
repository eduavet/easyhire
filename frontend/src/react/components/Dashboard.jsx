import React, { Component } from 'react';
import { Link, Route, Switch, BrowserRouter} from 'react-router-dom';
import Header from './Header.jsx'
import Toolbar from './Toolbar.jsx';
import Sidebar from './sidebar.jsx';
import Emails from './Emails.jsx';
import Refresh from './Refresh.jsx';

export default class Dashboard extends Component{
    render(){
        return(<BrowserRouter>
            <div>
                <Header/>
                <div className="container-fluid mt-4">
                    <div className='row'>
                        <Refresh/>
                        <Toolbar/>
                    </div>
                    <div className="row">
                        <Sidebar/>
                        <Emails/>
                    </div>
                </div>
            </div>
        </BrowserRouter>)
    }
}
