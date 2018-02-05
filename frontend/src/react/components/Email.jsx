import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

class Email extends Component{
  changeStatus = (evt) => {
    console.log('status changed');
    console.log(evt);
    console.log(evt.target);
    console.log(evt.target.value);
  };
  render() {
    return (
      <div className="col-10 mt-4">
        <div className="d-flex justify-content-between text-center wrap-words">
          <h4 className="w-20"><small>Sender: </small><br />{this.props.email.sender}</h4>
          <h3 className="w-20"><small>Subject: </small><br />{this.props.email.subject}</h3>
          <div className="w-20">
            <label htmlFor="selectStatus">Change Status</label>
            <select className="form-control" id="selectStatus" onChange={this.changeStatus}>
              <option>{this.props.email.folderName}</option>
              <option>Approved</option>
              <option>Interview</option>
              <option>4</option>
              <option>5</option>
            </select>
          </div>
          <p className="w-20"><small>Date: </small><br />{this.props.email.date}</p>
        </div>
        <hr />
        <div className="emailContentContainer" dangerouslySetInnerHTML={{ __html: this.props.email.htmlBody }}></div>
        {/*<iframe dangerouslySetInnerHTML={{ __html: props.email.htmlBody }} title="Email Content"></iframe>*/}
      </div>
    );
  }

}
Email.propTypes = {
  email: PropTypes.object.isRequired,
};
function mapStateToProps(state) {
  return {
    email: state.email.email,
  };
}

function mapDispatchToProps(dispatch) {
  return {};
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Email);
