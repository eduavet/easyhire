import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Table } from 'reactstrap';
import PropTypes from 'prop-types';
import { isChecked } from '../../redux/reducers/emailsReducer';

const Loader = require('react-loader');

class Emails extends Component {
  toggleCheckbox = (item) => {
    this.props.isChecked(item);
  };
  render() {
    return (
      <div className="col-10 mt-4">
        <Loader loaded={this.props.loaded}>
          <Table size="sm">
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
              {this.props.emails.map(item => (
                <tr key={item.emailID} className={item.isRead ? '' : 'isUnread'}>
                  <td>
                    <div className="checkbox checkbox-success">
                      <input type="checkbox" key={item.emailID} checked={item.isChecked} onClick={() => this.toggleCheckbox(item)} ref={(a) => { this._inputElement = a; }} />
                    </div>
                  </td>
                  <td className={item.isRead ? 'text-center' : 'text-center bold'}>{item.sender}</td>
                  <td><span className={item.isRead ? '' : 'bold'}>{item.subject}</span><span className="snippet"> - {item.snippet}</span></td>
                  <td>{item.folderName}</td>
                  <td>{item.date}</td>
                  <td>{item.attachment ? <i className="fas fa-paperclip" /> : ''}</td>
                </tr>))}
            </tbody>
          </Table>
        </Loader>
      </div>
    );
  }
}

Emails.propTypes = {
  isChecked: PropTypes.func.isRequired,
  loaded: PropTypes.bool.isRequired,
  emails: PropTypes.array.isRequired,
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
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Emails);
