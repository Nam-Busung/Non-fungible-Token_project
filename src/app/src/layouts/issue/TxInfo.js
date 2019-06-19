import React, { Component } from 'react'
import PropTypes from 'prop-types';

class TxInfo extends Component {

    constructor(props, context) {
        super(props);
        this.drizzle = context.drizzle;
    }

    render() {

        const state = this.drizzle.store.getState();

        if (this.props.stackId !== undefined && this.props.stackId !== null) {
            return (
                <p>
                    {state.transactionStack[this.props.stackId]}
                </p>
            )
        } else {
            return null;
        }
    }
}

TxInfo.contextTypes = {
    drizzle: PropTypes.object
}


export default TxInfo