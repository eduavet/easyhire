import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Table } from 'reactstrap';
import PropTypes from 'prop-types';
import { Link, Route, Switch } from 'react-router-dom';
import { isChecked } from '../../redux/reducers/emailsReducer';
import { asyncgetEmailFromDb } from '../../redux/reducers/emailReducer';

const Loader = require('react-loader');

class Emails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pageActive: Object.assign([], new Array(10).fill(false), { 1: true }),
      currentPage: 1,
      emailsPerPage: 15,
      sortedSender: false,
      sortedSubject: false,
      sortedStatus: false,
      sortedDate: false,
    };
  }

  componentDidMount = () => {
    this.setState({ pageCount: (this.props.emails.length / 2 + 1) });
  };

  openPage = (e) => {
    this.setState({
      pageActive: Object.assign([], new Array(10).fill(false), { [e.target.textContent]: true }),
      currentPage: parseInt(e.target.textContent),
    });
  };

  prevPage = (e) => {
    if (this.state.currentPage > 1) {
      this.setState({
        pageActive: Object.assign([], new Array(10).fill(false), { [this.state.currentPage - 1]: true }),
        currentPage: parseInt(this.state.currentPage - 1),
      });
    }
  };

  nextPage = (e) => {
    if (this.state.currentPage < this.props.emails.length / this.state.emailsPerPage) {
      this.setState({
        pageActive: Object.assign([], new Array(10).fill(false), { [this.state.currentPage + 1]: true }),
        currentPage: parseInt(this.state.currentPage + 1),
      });
    }
  };

  toggleCheckbox = (item) => {
    this.props.isChecked(item);
  };
  openEmail = (evt) => {
    this.props.getEmailFromDb(evt.target.dataset.id);
  };
  sortBySender = () => {
    if (!this.state.sortedSender) {
      this.props.emails.sort((a, b) => {
        const nameA = a.sender.toUpperCase(); // ignore upper and lowercase
        const nameB = b.sender.toUpperCase(); // ignore upper and lowercase
        return nameA < nameB ? -1 : nameA > nameB ? 1 : 0;
      });
      this.setState({ sortedSender: !this.state.sortedSender });
    } else {
      this.props.emails.sort((a, b) => {
        const nameA = a.sender.toUpperCase(); // ignore upper and lowercase
        const nameB = b.sender.toUpperCase(); // ignore upper and lowercase
        return nameA < nameB ? 1 : nameA > nameB ? -1 : 0;
      });
      this.setState({ sortedSender: !this.state.sortedSender });
    }
  };
  sortBySubject = () => {
    if (!this.state.sortedSubject) {
      this.props.emails.sort((a, b) => {
        const nameA = a.subject.toUpperCase(); // ignore upper and lowercase
        const nameB = b.subject.toUpperCase(); // ignore upper and lowercase
        return nameA < nameB ? -1 : nameA > nameB ? 1 : 0;
      });
      this.setState({ sortedSubject: !this.state.sortedSubject });
    } else {
      this.props.emails.sort((a, b) => {
        const nameA = a.subject.toUpperCase(); // ignore upper and lowercase
        const nameB = b.subject.toUpperCase(); // ignore upper and lowercase
        return nameA < nameB ? 1 : nameA > nameB ? -1 : 0;
      });
      this.setState({ sortedSubject: !this.state.sortedSubject });
    }
  };
  sortByStatus = () => {
    if (!this.state.sortedStatus) {
      this.props.emails.sort((a, b) => {
        const nameA = a.status.toUpperCase(); // ignore upper and lowercase
        const nameB = b.status.toUpperCase(); // ignore upper and lowercase
        return nameA < nameB ? -1 : nameA > nameB ? 1 : 0;
      });
      this.setState({ sortedStatus: !this.state.sortedStatus });
    } else {
      this.props.emails.sort((a, b) => {
        const nameA = a.status.toUpperCase(); // ignore upper and lowercase
        const nameB = b.status.toUpperCase(); // ignore upper and lowercase
        return nameA < nameB ? 1 : nameA > nameB ? -1 : 0;
      });
      this.setState({ sortedStatus: !this.state.sortedStatus });
    }
  };
  sortByDate = () => {
    if (!this.state.sortedDate) {
      this.props.emails.sort((a, b) => new Date(a.date) - new Date(b.date));
      this.setState({ sortedDate: !this.state.sortedDate });
    } else {
      this.props.emails.sort((a, b) => new Date(b.date) - new Date(a.date));
      this.setState({ sortedDate: !this.state.sortedDate });
    }
  };
  render() {
    const pages = [];
    for (let i = 1; i <= Math.ceil(this.props.emails.length / this.state.emailsPerPage); i += 1) {
      pages.push(
        <li
          key={i}
          className={this.state.pageActive[i] ? 'page-item active' : 'page-item'}
          onClick={this.openPage}
        >
          <a className="page-link paging" href="#">{i}</a>
        </li>);
    }
    return (
      <div className="col-10 mt-4">
        <Loader loaded={this.props.loaded}>
          <table size="" className="table-sm emailsTable" data-toggle="table">
            <thead>
              <tr>
                <th />
                <th>Sender<div className="btn" onClick={this.sortBySender}><i className="fa fa-fw fa-sort" /></div></th>
                <th>Subject<div className="btn" onClick={this.sortBySubject}><i className="fa fa-fw fa-sort" /></div></th>
                <th>Status<div className="btn d-inline" onClick={this.sortByStatus}><i className="fa fa-fw fa-sort" /></div></th>
                <th>Date<div className="btn" onClick={this.sortByDate}><i className="fa fa-fw fa-sort" /></div></th>
                <th />
              </tr>
            </thead>
            <tbody>
              {this.props.emails.map((item, index) => {
                if (index < this.state.emailsPerPage * (this.state.currentPage - 1) ||
                   index >= this.state.emailsPerPage * (this.state.currentPage)) {
                     return;
                   }
                return (
                  <tr key={item.emailId} className={item.isRead ? '' : 'isUnread'}>
                    <td>
                      <div className="checkbox checkbox-success">
                        <input
                          type="checkbox" key={item.emailId} checked={item.isChecked}
                          onClick={() => this.toggleCheckbox(item)}
                          ref={(a) => { this._inputElement = a; }}
                        />
                      </div>
                    </td>
                    <td >
                      <Link className={item.isRead ? 'text-center' : 'text-center bold'} to={`/email/${item.emailId}`} data-id={item.emailId} onClick={this.openEmail}>
                        {item.sender}
                      </Link>
                    </td>
                    <td>
                      <Link to={`/email/${item.emailId}`} data-id={item.emailId} onClick={this.openEmail}>
                        <span className={item.isRead ? '' : 'bold'}>
                          {item.subject}
                        </span>
                        <span className="snippet">
                          - {item.snippet}
                        </span>
                      </Link>
                    </td>
                    <td>{item.statusName}</td>
                    <td>{item.date}</td>
                    <td>{item.attachment ? <i className="fas fa-paperclip" /> : ''}</td>
                  </tr>);
              })
            }
            </tbody>
          </table>
          {this.props.emails.length > this.state.emailsPerPage ?
            <nav aria-label="Email pages" className="paging">
              <ul className="pagination justify-content-center">
                <li className="page-item" onClick={this.prevPage}><a className="page-link paging" href="#">Previous</a></li>
                {pages}
                <li className="page-item" onClick={this.nextPage}><a className="page-link paging" href="#">Next</a></li>
              </ul>
            </nav>
            : ''
          }
        </Loader>
      </div>
    );
  }
}

Emails.propTypes = {
  isChecked: PropTypes.func.isRequired,
  loaded: PropTypes.bool.isRequired,
  emails: PropTypes.array.isRequired,
  getEmailFromDb: PropTypes.func.isRequired,
};

function mapStateToProps(state) {
  return {
    emails: state.emails.emails,
    loaded: state.emails.loaded,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    isChecked: item => dispatch(isChecked(item)),
    getEmailFromDb: item => dispatch(asyncgetEmailFromDb(item)),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Emails);
