import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { asyncCreateFolder } from '../../redux/reducers/emailsReducer';

export default class ModalUpdateFolder extends Component {
  render() {
    return (
      <div className="d-inline">
        <Modal isOpen={this.props.isOpenUpdate} toggle={this.toggle}>
          <ModalHeader toggle={this.props.toggleUpdateModal}>Edit folder name</ModalHeader>
          <ModalBody>
            <form>
              <div className="form-group">
                <label htmlFor="folderName">Folder Name</label>
                <input type="text" className="form-control" id="folderName" placeholder="Enter folder name"/>
              </div>
              <hr className={"mt-4"}/>
              <div className="form-group">
                <Button color="secondary float-right" onClick={this.props.toggleUpdateModal}>Cancel</Button>
                <button className="btn bg-light-blue float-right mr-2" onClick={this.props.updateFolder}>Save!</button>
              </div>
            </form>
          </ModalBody>
        </Modal>
      </div>
    )
  }
}

// function mapStateToProps(state) {
//   return {};
// }
//
// function mapDispatchToProps(dispatch) {
//   return {
//     // updateFolder: (param) => dispatch(asyncUpdateFolder(param))
//   };
// }
//
// export default connect(
//   mapStateToProps,
//   mapDispatchToProps
// )(ModalUpdateFolder);
