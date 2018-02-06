import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Table } from 'reactstrap';
import PropTypes from 'prop-types';
import { Link, Route, Switch } from 'react-router-dom';
import { isChecked } from '../../redux/reducers/emailsReducer';
import { asyncGetEmail } from '../../redux/reducers/emailReducer';

const Loader = require('react-loader');

class Emails extends Component {
  constructor(props){
    super(props);
    this.state = {
      pageActive: Object.assign([], new Array(10).fill(false), {1: true}),
      currentPage: 1,
      emailsPerPage: 15
    }
  }

  componentDidMount = () => {
    this.setState({pageCount: (this.props.emails.length/2 + 1)})
  }

  openPage = (e) => {
    this.setState({
      pageActive: Object.assign([], new Array(10).fill(false), {[e.target.textContent]: true}),
      currentPage: parseInt(e.target.textContent)
    });
  }

  prevPage = (e) => {
    if(this.state.currentPage > 1) {
      this.setState({
        pageActive: Object.assign([], new Array(10).fill(false), {[this.state.currentPage - 1]: true}),
        currentPage: parseInt(this.state.currentPage - 1)
      });
    }
  }

  nextPage = (e) => {
    if(this.state.currentPage < this.props.emails.length/this.state.emailsPerPage) {
      this.setState({
        pageActive: Object.assign([], new Array(10).fill(false), {[this.state.currentPage + 1]: true}),
        currentPage: parseInt(this.state.currentPage + 1)
      });
    }
  }

  toggleCheckbox = (item) => {
    this.props.isChecked(item);
  };
  openEmail = (evt) => {
    this.props.getEmail(evt.target.dataset.id);
  };
  render() {
    const pages = [];
    for (let i = 1; i <= Math.ceil(this.props.emails.length/this.state.emailsPerPage); i += 1) {
      pages.push(
        <li key={i} className={this.state.pageActive[i] ? "page-item active" : "page-item"}
          onClick={this.openPage}>
          <a className="page-link" href="#">{i}</a>
        </li>
      )
    }
    return (
      <div className="col-10 mt-4">
        <Loader loaded={this.props.loaded}>
          <Table size="sm" className="emailsTable">
            <thead>
              <tr>
                <th />
                <th>Sender</th>
                <th>Subject</th>
                <th>Status</th>
                <th>Date</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {this.props.emails.map((item, index) => {
                if(index < this.state.emailsPerPage * (this.state.currentPage - 1) ||
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
          </Table>
          {this.props.emails.length > this.state.emailsPerPage ?
                <nav aria-label="Email pages">
                  <ul className="pagination justify-content-center">
                    <li className="page-item" onClick={this.prevPage}><a className="page-link" href="#">Previous</a></li>
                    {pages}
                    <li className="page-item" onClick={this.nextPage}><a className="page-link" href="#">Next</a></li>
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
  getEmail: PropTypes.func.isRequired,
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
    getEmail: item => dispatch(asyncGetEmail(item)),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Emails);
