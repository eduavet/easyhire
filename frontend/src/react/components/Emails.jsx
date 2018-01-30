import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link, Route, Switch, BrowserRouter} from 'react-router-dom';
import { Table } from 'reactstrap';

export default class Emails extends Component{
    constructor(){
        super();
        this.state = {
            value: false,
            emails: [{sender: "Alice", subject: "JS developer", snippet: "Dear Tatevik", status: "Approved", date: '12/02/18', attachment: true}]
        }
    }
    toggleCheckbox=(item)=>{
        this.props.isChecked(item)

    }
    render(){
        console.log(this.props.emails)
        return(<div className="col-10 mt-4">
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
                    return <tr key={item.email+item.date}>
                        <td><div className="checkbox checkbox-success">
                            <input type="checkbox" key={item.email+item.date} checked={!!item.isChecked} onClick={()=>this.toggleCheckbox(item)} ref={(a) => {this._inputElement = a}}>
                            </input></div></td>
                        <td className={"text-center"}>{item.sender}</td>
                        <td>{item.subject}<span className="snippet"> - {item.snippet}</span></td>
                        <td>status</td>
                        <td>{item.date}</td>
                        <td>{item.attachment?<i className="fas fa-paperclip"></i>:""}</td>
                    </tr>
                })}
                </tbody>
            </Table>
        </div>)
    }
}
