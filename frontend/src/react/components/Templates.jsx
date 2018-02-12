import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { notify } from 'react-notify-toast';
import { asyncGetTemplates, asyncGetTemplate, asyncAddTemplate, asyncUpdateTemplate, asyncDeleteTemplate } from '../../redux/reducers/settingsReducer';

const Loader = require('react-loader');

class Templates extends Component {

  componentDidMount() {
    this.props.getEmailFromGapi(emailId);
  }
  render() {
    return (
      <div className="col-10 mt-4">
        <Loader loaded={this.props.loaded}>
        </Loader>
      </div>
    );
  }
}

Templates.propTypes = {
  templates: PropTypes.array.isRequired,
};

Templates.defaultProps = {

};

function mapStateToProps(state) {
  return {
    templates: state.settings.templates,
    template: state.settings.template,
    loaded: state.settings.loaded,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    getTemplates: () => dispatch(asyncGetTemplates()),
    getTemplate: templaiteId => dispatch(asyncGetTemplate(templaiteId)),
    addTemplate: (name, content) => dispatch(asyncAddTemplate(name, content)),
    updateTemplate: (templateId, name, content) => dispatch(asyncUpdateTemplate(templateId, name, content)),
    deleteTemplate: templateId => dispatch(asyncDeleteTemplate(templateId)),

  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Templates);

