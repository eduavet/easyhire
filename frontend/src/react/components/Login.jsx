import React, { Component } from 'react';
import { Link, Route, Switch, BrowserRouter} from 'react-router-dom';

export default class Login extends Component{
    render(){
        return (
          <div className="login-background">
            <a className="btn loginBtn loginBtn--google" href="http://localhost:3000/auth/google">Login with Google</a>
          </div>
        )
    }
}
