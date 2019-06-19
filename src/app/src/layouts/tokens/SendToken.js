import React, { Component } from 'react'
import PropTypes from 'prop-types';
import {Button, Form, FormControl, FormGroup, InputGroup} from "react-bootstrap";

class SendToken extends Component {

    constructor(props, context) {
        super(props);
        this.state = context.drizzle.store.getState();
        this.contracts = context.drizzle.contracts;
        this.deedIPFSToken = this.contracts.DeedIPFSToken;
    }

    handleSubmit = () => {

        const tokenId = this.props.tokenId;
        const buttonType = this.props.buttonType;
        const from = this.state.accounts[0];
        const to = this.toAddress.value;

        if (buttonType === 'T') { //transferFrom
            this.deedIPFSToken.methods.transferFrom.cacheSend(from, to, tokenId);

        } else if (buttonType === "A") { //approve
            this.deedIPFSToken.methods.approve.cacheSend(to, tokenId);
        }

    }

    render () {
        if (this.props.flag) {
            return (
                <Form inline style={{marginBottom: "5px"}}>
                    <FormGroup controlId="addr">
                        <InputGroup>
                            <InputGroup.Addon>@</InputGroup.Addon>
                            <FormControl type="text" label="Text"
                                         placeholder="Enter Ethereum address"
                                         style={{width: "366px"}}
                                         inputRef={ref => this.toAddress = ref}/>
                        </InputGroup>{' '}
                        <Button type="button" onClick={this.handleSubmit}>Submit</Button>
                    </FormGroup>
                </Form>
            )
        }
        return <br/>
    }
}


SendToken.contextTypes = {
    drizzle: PropTypes.object
}

export default SendToken;
