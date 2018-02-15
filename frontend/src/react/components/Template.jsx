import React, { Component } from 'react';
import DateTime from 'react-datetime';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Editor } from '@tinymce/tinymce-react';
import { asyncGetTemplate, asyncAddTemplate, asyncUpdateTemplate } from '../../redux/reducers/settingsReducer';

class Template extends Component {
  constructor(...args) {
    super(...args);
    this.state = {
      templateName: '',
      datepickerStyle: 'hideDatetimepicker',
      dateTime: '',
      dateTimeContainerClass: 'dateTimePickerClosed',
    };
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps === this.props) {
      return;
    }
    if (nextProps.template !== this.props.template) {
      const oldContent = this.props.template && this.props.template.content ? this.props.template.content : '';
      const newContent = nextProps.template && nextProps.template.content ? nextProps.template.content : '';
      if (newContent !== oldContent) {
        if (this._editor) {
          this._editor.editor.setContent(decodeURIComponent(newContent));
        }
      }
      const oldName = this.props.template && this.props.template.name ? this.props.template.name : '';
      const newName = nextProps.template && nextProps.template.name ? nextProps.template.name : '';
      if (oldName !== newName) {
        this.setState({ templateName: newName });
      }
    }
  }
  changeName = (evt) => {
    const name = evt.target.value;
    this.setState({ templateName: name });
  };
  saveTemplate = (evt) => {
    evt.preventDefault();
    const templateId = this.props.template._id;
    const templateName = this.templateNameRef.value;
    const templateContent = this._editor.editor.getContent();
    if (templateId) {
      this.props.updateTemplate(templateId, templateName, templateContent);
    } else {
      this.props.addTemplate(templateName, templateContent);
    }
  };
  changeDatepicker = (moment) => {
    const dateTime = moment.format('DD/MM/YYYY, HH:mm');
    this.setState({ dateTime });
  };
  closeDateTimepicker = () => {
    const insertValue = this.state.dateTime ? `&nbsp;${this.state.dateTime}&nbsp;` : '';
    this.setState({ datepickerStyle: 'hideDatetimepicker', dateTimeContainerClass: 'dateTimePickerClosed', dateTime: '' });
    this._editor.editor.insertContent(insertValue);
  };
  render() {
    return (
      <form>
        <div className="form-group">
          <input type="text" ref={(editor) => { this.templateNameRef = editor; }} className="form-control" id="templateName" placeholder="Enter template name" onChange={this.changeName} value={this.state.templateName} />
        </div>
        <div className="form-group">
          <div className="editorDateTimePickerContainer">
            <Editor
              ref={(editor) => { this._editor = editor; }}
              initialValue=""
              content={this.props.template}
              init={{
              plugins: 'link image code insertdatetime advlist autolink lists charmap print preview hr anchor pagebreak,'
              + 'searchreplace wordcount visualblocks visualchars fullscreen,'
              + 'media nonbreaking save table contextmenu directionality,'
              + 'emoticons template paste textcolor colorpicker textpattern',
              toolbar1: 'insertfile undo redo | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image',
              toolbar2: 'print preview media | forecolor backcolor emoticons | insertdatetime',
              toolbar3: 'Datepicker',
              relative_urls: false,
              remove_script_host: false,
              image_advtab: true,
              height: '320',
              setup: (editor) => {
              editor.addButton('Datepicker', {
                text: 'DateTimepicker',
                icon: 'insertdatetime',
                onclick: () => {
                  const toggleClass = this.state.datepickerStyle ? '' : 'hideDatetimepicker';
                  const toggleContainerClass = this.state.datepickerStyle ? '' : 'dateTimePickerClosed';
                  const insertValue = this.state.datepickerStyle ? '' : `&nbsp;${this.state.dateTime}&nbsp;`;
                  this.setState({
                    datepickerStyle: toggleClass,
                    dateTimeContainerClass: toggleContainerClass,
                    dateTime: '',
                  });
                  this._editor.editor.insertContent(insertValue);
                },
              });
            },
            }}
            />
            <div className={`dateTimeContainer ${this.state.dateTimeContainerClass}`}>
              <button type="button" className="btn btn-close-datepicker" onClick={this.closeDateTimepicker}>&times;</button>
              <DateTime
                className={this.state.datepickerStyle}
                onChange={moment => this.changeDatepicker(moment)}
                ref={(picker) => { this._datepicker = picker; }}
                input={false}
              />
            </div>
          </div>
        </div>
        <button onClick={this.saveTemplate} className="btn btn-info shineBtn">Save!</button>
      </form>
    );
  }
}

Template.propTypes = {
  template: PropTypes.object.isRequired,
  addTemplate: PropTypes.func.isRequired,
  updateTemplate: PropTypes.func.isRequired,
};

Template.defaultProps = {

};

function mapStateToProps(state) {
  return {
    template: state.settings.template,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    getTemplate: templateId => dispatch(asyncGetTemplate(templateId)),
    addTemplate: (name, content) => dispatch(asyncAddTemplate(name, content)),
    updateTemplate: (templateId, name, content) =>
      dispatch(asyncUpdateTemplate(templateId, name, content)),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Template);
