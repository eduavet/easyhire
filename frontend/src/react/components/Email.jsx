import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { asyncChangeEmailStatus, asyncGetEmailFromGapi } from '../../redux/reducers/emailReducer';

class Email extends Component {
  // componentWillMount() {
  //
  // }
  // componentWillReceiveProps(nextProps) {
  //   const emailId = this.props.email.emailId;
  //   console.log('componentWillMount', emailId);
  //   this.props.getEmailFromGapi(emailId);
  // }
  changeStatus = (evt) => {
    const statusId = evt.target.value;
    const emailId = this.props.email.emailId;
    this.props.changeEmaulStatus(emailId, statusId);
  };
  render() {
    return (
      <div className="col-10 mt-4">
        <div className="d-flex justify-content-between text-center wrap-words">
          <h4 className="w-20"><small>Sender: </small><br />{this.props.email.sender}</h4>
          <h3 className="w-20"><small>Subject: </small><br />{this.props.email.subject}</h3>
          <div className="w-20">
            <label htmlFor="selectStatus">Change Status</label>
            <select className="form-control" id="selectStatus" onChange={this.changeStatus} value={this.props.email.status}>
              {this.props.statuses
                .map(status => <option key={status._id} value={status._id}>{status.name}</option>)}
            </select>
          </div>
          <p className="w-20"><small>Date: </small><br />{this.props.email.date}</p>
        </div>
        <hr />
        <div className="btn-group" role="group">
          <button type="button" className="btn bg-light-blue tooltip-toggle" data-tooltip="Email will be sent in this thread">Reply</button>
          <button type="button" className="btn btn-success ml-2 tooltip-toggle" data-tooltip="This will send new email">Send Email</button>
        </div>
        <div className="emailContentContainer email-border-top" dangerouslySetInnerHTML={{ __html: this.props.email.htmlBody }} />
        <div className="col-6 email-border-top">
          <label htmlFor="addNoteTextarea">Add note</label>
          <div className="notes">
            <textarea className="form-control" id="addNoteTextarea" rows="3" placeholder="Type.Note will be saved Automaticly"></textarea>
            <span className="noteSaveStatus">Saved!</span>
          </div>
        </div>
        {/* <iframe dangerouslySetInnerHTML={{ __html: props.email.htmlBody }} title="Email Content"></iframe> */}
      </div>
    );
  }
}
Email.propTypes = {
  email: PropTypes.object.isRequired,
  statuses: PropTypes.array.isRequired,
  changeEmaulStatus: PropTypes.func.isRequired,
  getEmailFromGapi: PropTypes.func.isRequired,
};
function mapStateToProps(state) {
  return {
    email: state.email.email,
    statuses: state.statuses.statuses,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    getEmailFromGapi: emailId => dispatch(asyncGetEmailFromGapi(emailId)),
    changeEmaulStatus: (emailId, statusId) => dispatch(asyncChangeEmailStatus(emailId, statusId)),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Email);
