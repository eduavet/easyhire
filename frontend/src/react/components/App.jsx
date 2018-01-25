import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link,Route, Switch, BrowserRouter} from 'react-router-dom';
import Sidebar from './sidebar.jsx';
import jwt from 'jsonwebtoken';


// import { example } from '../appRedux/reducers/exampleReducer';

const url = 'http://localhost:3000/api/addUser/';



/* Home component */
const Home = () => (
    <div>
        <h2>Home</h2>
    </div>
);

/* Category component */
const Category = () => (
    <div>
        <h2>Category</h2>
    </div>
);

/* Products component */
const Products = () => (
    <div>
        <h2>Products</h2>
    </div>
);
class App extends Component {
    constructor(){
        super();
        this.state = {
            googleID:'',
            id_token: '',
            access_token: '',
        }
    }
  componentDidMount(){
    window.onSignIn = (googleUser) => {
      var profile = googleUser.getBasicProfile();
      var id_token = googleUser.getAuthResponse().id_token;
      var access_token = googleUser.getAuthResponse().access_token;
      console.log(googleUser.getAuthResponse())
      const newUser = {
        googleID: profile.getId(),
        name: profile.getName(),
        imageURL: profile.getImageUrl(),
        email: profile.getEmail()
      }
        this.setState({googleID: profile.getId(), id_token, access_token });
      fetch(url, {
        method: 'POST',
        body: JSON.stringify(newUser),
        headers: new Headers({
          'Content-Type': 'application/json'
        })
      })
      .catch(console.error)
    }

  }
  getEmails = () => {

  }
    getEmails2 = () => {
        const googleID=this.state.googleID
        const id_token = this.state.id_token;
        console.log(googleID,id_token,JSON.stringify({googleID,id_token}));
        fetch('http://localhost:3000/auth/google/callback', {
            method: 'POST',
            body: JSON.stringify({googleID,id_token}),
            headers: new Headers({
                'Content-Type': 'application/json'
            })
        })
    // this.init();

        gapi.load('client:auth2', () => {
            gapi.client.load('gmail', 'v1', () => {
                console.log('Loaded Gmail');
                var request = gapi.client.gmail.users.messages.list({
                    'userId': googleID,
                    'scope': 'https://www.googleapis.com/auth/gmail.modify'
                    // 'id': messageId
                });
                request.then(res=> {
                    console.log(res, 'messages')
                }).catch(err=>{
                    console.log(err, 'messages err')})
            });
        })

      // // console.log(this.state.googleID)
      //   const id_token = this.state.id_token;
      //   // const access_token = this.state.access_token;
      // console.log('id_token', id_token)
      //   // var decoded = jwt.verify(id_token);
      //   // console.log('decoded',decoded) // bar
      // // console.log('access_token', access_token)
      //   const url = 'https://www.googleapis.com/gmail/v1/users/'+this.state.googleID+'/messages?key='+id_token;
      // console.log(gapi)
      //
      //
      //   gapi.client.load('plus', 'v1', function() {
      //
      //       var request = gapi.client.plus.people.get({
      //           'userId': googleID
      //       });
      //
      //       request.execute(function(response) {
      //           console.log(response);
      //       });
      //   });


        // gapi.client.load('plus', 'v1', function() {
        //
        //     var request = gapi.client.plus.people.get({
        //         'userId': googleID
        //     });
        //
        //     request.execute(function(response) {
        //         console.log(response);
        //     });
        // });
        // var request = gapi.client.gmail.users.messages.get({
        //     'userId': googleID,
        //     // 'id': messageId
        // });
        // request.then(res=> console.log(res)).catch(err=>console.log(err))
        // fetch(url,{
        //     id_token,
        //     auth:id_token,
        //     Authorization:id_token,
        //     OAuthToken:id_token,
        //
        //         headers:{
        //         'id_token':id_token,
        //         'auth':id_token,
        //         'Authorization':id_token,
        //         'OAuthToken':id_token,
        //         // 'Content-Type': 'application/json'
        //             'Content-Type': 'application/x-www-form-urlencoded'
        //     }
        //
        // })
        //     .then((res) => res.json()).then(res => {
        //     console.log(res);
        // }).catch(err => {
        //     console.log(err);
        // })
    }
    render() {
        return (
            <BrowserRouter>
                <div className="App">
                    <h1>Hello World</h1>
                    <div className="g-signin2" ref="googleBtn" data-onsuccess="onSignIn"></div>
                    <button className="btn btn-success" onClick={this.getEmails}>Sync</button>
                    <div>
                        <nav className="navbar navbar-light">
                            <ul className="nav navbar-nav">

                                /* Link components are used for linking to other views */
                                <li><Link to="/">Homes</Link></li>
                                <li><Link to="/category">Category</Link></li>
                                <li><Link to="/products">Products</Link></li>

                            </ul>
                        </nav>
                        /* Route components are rendered if the path prop matches the current URL */
                        <Route path="/" component={Home}/>
                        <Route path="/category" component={Category}/>
                        <Route path="/products" component={Products}/>
                    </div>
                    <div className='container-fluid'>
                        <div className='row'>
                            <Sidebar />
                        </div>
                    </div>
                </div>
            </BrowserRouter>
        );
    }
}

function mapStateToProps(state) {
    return {
        // example: state.example
    };
}

function mapDispatchToProps(dispatch) {
    return {
        // example2: (param) => dispatch(example(param)),
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(App);
