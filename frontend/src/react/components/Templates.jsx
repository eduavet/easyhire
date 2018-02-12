import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Link, Route, Switch } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { notify } from 'react-notify-toast';
import Template from './Template.jsx';
import ModalDeleteTemplate from './ModalDeleteTemplate.jsx';
import { asyncGetTemplate, asyncGetTemplates, asyncDeleteTemplate, templateIsActive, createTemplate } from '../../redux/reducers/settingsReducer';


const Loader = require('react-loader');

const deleteId = { value: '' };

class Templates extends Component {
  constructor(...args) {
    super(...args);
    this.state = {
      deleteModal: false,
      deleteTemplateName: '',
    };
  }
  componentDidMount() {
    this.props.getTemplates();
  }
  selectTemplate = (evt) => {
    const templateId = evt.target.dataset.id ?
      evt.target.dataset.id :
      evt.target.parentElement.dataset.id;
    this.props.templateIsActive(templateId)
    this.props.getTemplate(templateId);
  };
  createTemplate = () => {
    this.props.templateIsActive('');
    this.props.createTemplate();
  };
  toggleDeleteModal = (evt) => {
    evt.stopPropagation();
    deleteId.value = evt.target.dataset ? evt.target.dataset.id : '';
    this.setState({
      deleteModal: !this.state.deleteModal,
      deleteTemplateName: evt.target.dataset.name,
    });
  };
  deleteTemplate = () => {
    this.props.deleteTemplate(deleteId.value);
    this.setState({ deleteModal: false, deleteTemplateName: '' });
  };
  render() {
    return (
      <Loader loaded={this.props.loaded}>
        <h1>Templates component</h1>
        <div className="row mt-4">
          <div className="col-3 mt-4">
            <ul className="list-group templates">
              {this.props.templates.map((template) => {
                const templateIsActive = template.isActive ? 'active-template' : '';
                return (
                  <li
                    key={template._id}
                    className={`list-group-item list-group-item-action ${templateIsActive}`}
                    onClick={this.selectTemplate} data-id={template._id}
                  >
                    <i className={`fa ${template.icon}`} aria-hidden="true" />
                    &nbsp;{template.name}
                    <i
                      className="fa fa-trash template-actions float-right" aria-hidden="true"
                      data-id={template._id} data-name={template.name}
                      onClick={ this.toggleDeleteModal}
                    />
                  </li>
                );
              })}
              <li
                key="AddNewTemplate"
                className="list-group-item list-group-item-action"
                onClick={this.createTemplate}
              >
                <i className="fa fa-circle" aria-hidden="true" />
                &nbsp; Create new Template
              </li>
              <ModalDeleteTemplate
                isOpenDelete={this.state.deleteModal}
                toggleDeleteModal={this.toggleDeleteModal}
                deleteTemplate={this.deleteTemplate}
                deleteTemplateName={this.state.deleteTemplateName}
              />
            </ul>
          </div>
          <div className="col-9 mt-4" >
            <Template />
          </div>
        </div>
      </Loader>
    );
  }
}

Templates.propTypes = {
  templates: PropTypes.array.isRequired,
  getTemplates: PropTypes.func.isRequired,
  getTemplate: PropTypes.func.isRequired,
  deleteTemplate: PropTypes.func.isRequired,
  createTemplate: PropTypes.func.isRequired,
  templateIsActive: PropTypes.func.isRequired,
  loaded: PropTypes.bool,
};

Templates.defaultProps = {

};

function mapStateToProps(state) {
  return {
    templates: state.settings.templates,
    loaded: state.settings.loaded,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    getTemplates: () => dispatch(asyncGetTemplates()),
    getTemplate: (templateId) => dispatch(asyncGetTemplate(templateId)),
    deleteTemplate: templateId => dispatch(asyncDeleteTemplate(templateId)),
    templateIsActive: templateId => dispatch(templateIsActive(templateId)),
    createTemplate: () => dispatch(createTemplate()),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Templates);

