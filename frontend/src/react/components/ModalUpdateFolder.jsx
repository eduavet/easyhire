import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { asyncCreateFolder } from '../../redux/reducers/emailsReducer';

class ModalUpdateFolder extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modal: false
    };
  }

  toggle = () => {
    this.setState({modal: !this.state.modal});
  };

  update = () => {
    alert('hi')
  };

  render() {
    return (
      <div className="d-inline">
        <i className="fa fa-pencil-alt float-right folder-actions" aria-hidden="true" onClick={this.toggle}></i>
        <Modal isOpen={this.state.modal} toggle={this.toggle}>
          <ModalHeader toggle={this.toggle}>Edit folder name</ModalHeader>
          <ModalBody>
            <form>
              <div className="form-group">
                <label htmlFor="folderName">Folder Name</label>
                <input type="text" className="form-control" id="folderName" placeholder="Enter folder name"/>
              </div>
            </form>
          </ModalBody>
          <ModalFooter>
            <button className="btn bg-light-blue" onClick={this.update}>Save</button>
            <Button color="secondary" onClick={this.toggle}>Cancel</Button>
          </ModalFooter>
        </Modal>
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {};
}

function mapDispatchToProps(dispatch) {
  return {
    updateFolder: (param) => dispatch(asyncUpdateFolder(param))
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ModalUpdateFolder);
