import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link,Route, Switch, BrowserRouter} from 'react-router-dom';

// import { example } from '../appRedux/reducers/exampleReducer';

const url = 'http://localhost:3000/api/todos/';

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
    render() {
        return (
            <BrowserRouter>
                <div className="App">
                    <h1>Hello World</h1>
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
