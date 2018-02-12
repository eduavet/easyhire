import React, { Component } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Link, Route, Switch } from 'react-router-dom';
import Header from './Header.jsx';
import Toolbar from './Toolbar.jsx';
import Sidebar from './Sidebar.jsx';
import Emails from './Emails.jsx';
import Refresh from './Refresh.jsx';
import Email from './Email.jsx';
import Compose from './Compose.jsx';
import Settings from './Settings.jsx';

export default class Dashboard extends Component {
  componentDidMount() {
    // Clear search field when changing folder
  }

  render() {
    return (
      <BrowserRouter>
        <div>
          <Header />
          <div className="container-fluid mt-4">
            <div className="row">
              <Refresh />
              <Toolbar ref="toolbar" />
              <Settings/>
            </div>
            <div className="row">
              <Sidebar />
              <Route exact path="/" component={Emails} />
              <Route exact path="/email/:id" component={Email} />
            </div>
            <Compose />
          </div>
        </div>
      </BrowserRouter>);
  }
}
