import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Button, Popover, PopoverHeader, PopoverBody } from 'reactstrap';
import { asyncGetTemplate, toggleButtonName, clearEmail } from '../../redux/reducers/emailReducer';
import { asyncGetSignature } from '../../redux/reducers/emailsReducer';
import { asyncGetTemplates } from '../../redux/reducers/settingsReducer';

class ComposeButton extends Component {
  constructor(...args) {
    super(...args);
    this.state = {
      composePopoverOpen: false,
    };
  }
  componentDidMount() {
    this.props.getTemplates();
  }
  handleComposePopover = () => {
    this.props.getSignature();
    this.setState({ composePopoverOpen: !this.state.composePopoverOpen });
    this.props.clearEmail();
  };
  selectedNewTemplate = (e) => {
    const templateId = e.target.value;
    this.props.toggleButtonName('send new');
    this.props.getTemplate(templateId);
    this.setState({ composePopoverOpen: false });
  };
  render() {
    return (
      <div>
        <Button className="btn btn-success composeButton shineBtn" id="composeButton" onClick={this.handleComposePopover}>
          <i className="fa fa-comment-alt" />
        &nbsp;Compose
        </Button>
        <Popover placement="right" isOpen={this.state.composePopoverOpen} target="composeButton" toggle={this.handleComposePopover}>
          <PopoverHeader>Select Template</PopoverHeader>
          <PopoverBody>
            <select className="form-control" onChange={this.selectedNewTemplate} defaultValue="_default">
              <option disabled value="_default"> -- select an option -- </option>
              <option value="noTemplate">No template</option>
              {this.props.templates.map(template =>
                <option key={template._id} value={template._id}>{template.name}</option>)}}
            </select>
          </PopoverBody>
        </Popover>
      </div>
    );
  }
}

ComposeButton.propTypes = {
  getTemplate: PropTypes.func.isRequired,
  getTemplates: PropTypes.func.isRequired,
  toggleButtonName: PropTypes.func.isRequired,
  getSignature: PropTypes.func.isRequired,
  templates: PropTypes.array.isRequired,
  clearEmail: PropTypes.func.isRequired,
};

function mapStateToProps(state) {
  return {
    templates: state.settings.templates,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    getSignature: () => dispatch(asyncGetSignature()),
    getTemplates: () => dispatch(asyncGetTemplates()),
    getTemplate: templateId => dispatch(asyncGetTemplate(templateId)),
    toggleButtonName: btnName => dispatch(toggleButtonName(btnName)),
    clearEmail: () => dispatch(clearEmail(dispatch)),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ComposeButton);
