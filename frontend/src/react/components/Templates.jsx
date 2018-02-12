import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Link, Route, Switch } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { notify } from 'react-notify-toast';
import { asyncGetTemplates, asyncGetTemplate, asyncAddTemplate, asyncUpdateTemplate, asyncDeleteTemplate } from '../../redux/reducers/settingsReducer';

const Loader = require('react-loader');

class Templates extends Component {

  componentDidMount() {
    this.props.getTemplates();
  }
  render() {
    return (
      <div className="col-10 mt-4">
        <Loader loaded={this.props.loaded}>
          <h1>Templates component</h1>
          <div className="col-2 mt-4">
            <ul className="list-group templates">
              {this.props.templates.map((template) => {
                const templateIsActive = template.isActive ? 'active-template' : '';
                return (
                  <li
                    key={template._id}
                    className={`list-group-item list-group-item-action ${templateIsActive}`}
                  >
                    <Link to={`/template/${template._id}`}>
                      <i className={`fa ${template.icon}`} aria-hidden="true" />
                      &nbsp;{template.name}
                      <div className="d-inline float-right">
                        <i
                          className="fa fa-pencil-alt folder-actions" aria-hidden="true"
                          data-id={template._id}
                        />
                        <i
                          className="fa fa-trash folder-actions" aria-hidden="true"
                          data-id={template._id} data-name={template.name}
                        />
                      </div>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
          <div className="col-10 mt-4" />
        </Loader>
      </div>
    );
  }
}

Templates.propTypes = {
  templates: PropTypes.array.isRequired,
  template: PropTypes.object.isRequired,
  getTemplates: PropTypes.func.isRequired,
  loaded: PropTypes.bool,
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
