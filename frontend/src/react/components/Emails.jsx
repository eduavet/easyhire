import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { isChecked, asyncGetEmails, asyncGetSentEmails } from '../../redux/reducers/emailsReducer';
import { asyncGetEmailFromDb, asyncGetThreadFromDb } from '../../redux/reducers/emailReducer';

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
  componentWillMount = () => {
    if (window.location.href === 'http://localhost:8080/' ||
        window.location.href === 'http://localhost:8080' ||
        window.location.href === 'http://localhost:8080/#') {
      this.props.getEmails();
    }
    // this.props.getSentEmails();
  }
  componentDidMount = () => {
    this.setState({ pageCount: (this.props.emails.length / 2 + 1) });
  };

  openPage = (e) => {
    this.setState({
      pageActive: Object.assign([], new Array(10).fill(false), { [e.target.textContent]: true }),
      currentPage: parseInt(e.target.textContent, 10),
    });
  };

  prevPage = () => {
    if (this.state.currentPage > 1) {
      this.setState({
        pageActive: Object.assign(
          [],
          new Array(10).fill(false),
          { [this.state.currentPage - 1]: true },
        ),
        currentPage: parseInt(this.state.currentPage - 1, 10),
      });
    }
  };

  nextPage = () => {
    if (this.state.currentPage < this.props.emails.length / this.state.emailsPerPage) {
      this.setState({
        pageActive: Object.assign(
          [],
          new Array(10).fill(false),
          { [this.state.currentPage + 1]: true },
        ),
        currentPage: parseInt(this.state.currentPage + 1, 10),
      });
    }
  };

  toggleCheckbox = (item) => {
    this.props.isChecked(item);
  };

  openEmail = (evt) => {
    const id = evt.target.dataset.id ?
      evt.target.dataset.id :
      evt.target.parentElement.dataset.id;
    const threadId = evt.target.dataset.threadid ?
      evt.target.dataset.threadid :
      evt.target.parentElement.dataset.threadid;
    this.props.getEmailFromDb(id);
    this.props.getThreadFromDb(threadId);
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
        const nameA = a.statusName.toUpperCase(); // ignore upper and lowercase
        const nameB = b.statusName.toUpperCase(); // ignore upper and lowercase
        return nameA < nameB ? -1 : nameA > nameB ? 1 : 0;
      });
      this.setState({ sortedStatus: !this.state.sortedStatus });
    } else {
      this.props.emails.sort((a, b) => {
        const nameA = a.statusName.toUpperCase(); // ignore upper and lowercase
        const nameB = b.statusName.toUpperCase(); // ignore upper and lowercase
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
          <a className="page-link paging" href="#top">{i}</a>
        </li>
      );
    }
    return (
      <div className="col-10 mt-4">
        <Loader loaded={this.props.loaded}>
          <table size="" className="table-sm emailsTable w-100" data-toggle="table">
            <thead>
              <tr>
                <th />
                <th>Sender<div className="btn" onClick={this.sortBySender}><i className="fa fa-fw fa-sort" /></div></th>
                <th>Subject<div className="btn" onClick={this.sortBySubject}><i className="fa fa-fw fa-sort" /></div></th>
                <th />
                <th>Status<div className="btn d-inline" onClick={this.sortByStatus}><i className="fa fa-fw fa-sort" /></div></th>
                <th>Date<div className="btn" onClick={this.sortByDate}><i className="fa fa-fw fa-sort" /></div></th>
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
                      <Link
                        className={item.isRead ? 'text-center' : 'text-center bold'}
                        to={`/email/${item.emailId}`}
                        data-id={item.emailId}
                        data-threadid={item.threadId}
                        onClick={this.openEmail}
                      >
                        {item.sender}
                      </Link>
                    </td>
                    <td>
                      <Link
                        to={`/email/${item.emailId}`}
                        data-id={item.emailId}
                        data-threadid={item.threadId}
                        onClick={this.openEmail}
                      >
                        <span className={item.isRead ? '' : 'bold'}>
                          {item.subject}
                        </span>
                        <span className="snippet">
                          - {item.snippet}
                        </span>
                      </Link>
                    </td>
                    <td>{item.attachments.length > 0 ? <i className="fas fa-paperclip" /> : ''}</td>
                    <td>{item.statusName}</td>
                    <td>{item.date}</td>
                  </tr>);
              })
            }
            </tbody>
          </table>
          {this.props.emails.length > this.state.emailsPerPage ?
            <nav aria-label="Email pages" className="paging">
              <ul className="pagination justify-content-center">
                <li className="page-item" onClick={this.prevPage}><a className="page-link paging" href="#top">Previous</a></li>
                {pages}
                <li className="page-item" onClick={this.nextPage}><a className="page-link paging" href="#top">Next</a></li>
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
  getEmails: PropTypes.func.isRequired,
  getSentEmails: PropTypes.func.isRequired,
  getThreadFromDb: PropTypes.func.isRequired,
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
    getEmailFromDb: item => dispatch(asyncGetEmailFromDb(item)),
    getEmails: () => dispatch(asyncGetEmails()),
    getSentEmails: () => dispatch(asyncGetSentEmails()),
    getThreadFromDb: (threadId) => dispatch(asyncGetThreadFromDb(threadId)),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Emails);
