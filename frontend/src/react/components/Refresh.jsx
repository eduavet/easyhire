import React, { Component } from 'react';
import {connect} from "react-redux";
import { asyncRefresh } from "../../redux/reducers/emailsReducer";

class Refresh extends Component {
    render () {
        return (
            <div className="col-2">
                <button className="btn sync-btn"  onClick={this.props.refresh}><i className="fa fa-sync-alt"></i> Refresh</button>
            </div>
        )
    }

}
function mapStateToProps(state) {
    return {};
}

function mapDispatchToProps(dispatch) {
    return {
        refresh: () => dispatch(asyncRefresh()),
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Refresh);