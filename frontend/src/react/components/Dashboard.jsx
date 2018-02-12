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
import { connect } from 'react-redux';
import Settings from './Settings.jsx';

export class Dashboard extends Component {
  componentDidUpdate() {
    // Clear search field when changing folder
    console.log(this.props.page);
  }

  render() {
    return (
      <BrowserRouter>
        <div>
          <Header />
          {
            this.props.page !== 'dashboard' ?
            <Settings/>
            :
            <div className="container-fluid mt-4">
              <div className="row">
                <Refresh />
                <Toolbar ref="toolbar" />
              </div>
              <div className="row">
                <Sidebar />
                <Route exact path="/" component={Emails} />
                <Route exact path="/email/:id" component={Email} />
              </div>
              <Compose />
            </div>
          }
        </div>
      </BrowserRouter>);
  }
}


function mapStateToProps(state) {
  return {
    page: state.folders.page,
  };
}

function mapDispatchToProps() {
  return {};
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Dashboard);
