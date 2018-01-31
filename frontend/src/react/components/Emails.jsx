import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link, Route, Switch, BrowserRouter} from 'react-router-dom';
import { Table } from 'reactstrap';
import { isChecked } from '../../redux/reducers/emailsReducer';

class Emails extends Component{
    toggleCheckbox = (item) => {
        this.props.isChecked(item)
    }
    render(){
        return(
          <div className="col-10 mt-4">
            <Table size="sm">
                <thead>
                <tr>
                    <th></th>
                    <th>Sender</th>
                    <th>Subject</th>
                    <th>Status</th>
                    <th>Date</th>
                    <th></th>
                </tr>
                </thead>
                <tbody>
                {this.props.emails.map(item => {
                    return <tr key={item.email + item.date}>
                        <td><div className="checkbox checkbox-success">
                            <input type="checkbox" key={item.email + item.date} checked={item.isChecked} onClick={() => this.toggleCheckbox(item)} ref={(a) => {this._inputElement = a}}>
                            </input></div></td>
                        <td className={"text-center"}>{item.sender}</td>
                        <td>{item.subject}<span className="snippet"> - {item.snippet}</span></td>
                        <td>{item.folderName}</td>
                        <td>{item.date}</td>
                        <td>{item.attachment?<i className="fas fa-paperclip"></i>:""}</td>
                    </tr>
                })}
                </tbody>
            </Table>
        </div>
      )
    }
}

function mapStateToProps(state) {
  return {
    emails: state.emails
  };
}

function mapDispatchToProps(dispatch) {
  return {
    isChecked: (bool, item) => dispatch(isChecked(bool, item)),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Emails);
