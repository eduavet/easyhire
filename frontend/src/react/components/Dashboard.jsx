import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Link, Route, Switch } from 'react-router-dom';
import Header from './Header.jsx';
import Toolbar from './Toolbar.jsx';
import Sidebar from './Sidebar.jsx';
import Emails from './Emails.jsx';
import Refresh from './Refresh.jsx';
import Email from './Email.jsx';

export default function Dashboard() {
  return (<BrowserRouter>
    <div>
      <Header />
      <div className="container-fluid mt-4">
        <div className="row">
          <Refresh />
          <Toolbar />
        </div>
        <div className="row">
          <Sidebar />
          <Route exact path="/" component={Emails} />
          <Route exact path="/email/:id" component={Email} />
        </div>
      </div>
    </div>


  </BrowserRouter>);
}
