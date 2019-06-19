import React, { Component } from 'react'
import PropTypes from 'prop-types';
import styled from "styled-components";
import ipfs from '../../utils/ipfs';
import { drizzleConnect } from 'drizzle-react'
import { BASE_URI } from '../../constants/general';
import axios from "axios";
import moment from 'moment';
import Image from '../../components/DataDisplay/Image';

class HistoryDetail extends Component {
    state = {
        imageUrl:'',
    }
    deleted = false;

    constructor(props, context) {
        super(props);
        this.contracts = context.drizzle.contracts;
        this.deedIPFSToken = this.contracts.DeedIPFSToken;
    }

    componentWillMount() {
    }

    componentDidMount() {
    }

    render() {
        const { item } = this.props.location;
        console.log("TCL: HistoryDetail -> render -> item", item)
        const transactions = Object.keys(item).map(key => {
            if(key === "id" || key === "image") return null;
            const each = item[key];

            return (
                <TransactionContainer>
                    <From>
                        From : {each.from}
                    </From>
                    <To>
                        To : {each.to}
                    </To>
                    <Price>
                        Price : {each.price}
                    </Price>
                    {/* <Date>
                        Date: {moment.unix(item.transactionDate).format('YYYY.MM.DD')}
                    </Date> */}
                </TransactionContainer>
            )
        })

        return (
            <Container>
                <Image src={item.image}/>
                {transactions}
                {/* <Title>
                    Title: {item.title}
                </Title>
                <fromUser>
                    from: {item.fromuserId}
                </fromUser>
                <toUser>
                    to: {item.touserId}
                </toUser>
                <Price>
                    Price: {item.price}
                </Price>
                <Due>
                    Due: {moment.unix(item.due).format('YYYY.MM.DD')}
                </Due> */}
            </Container>
        )
    }
}

const Container = styled.div`
    display:flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
`;

const TransactionContainer = styled.div`
    display:flex;
    flex-direction: column;
    border:1px solid #bcbcbc;
    padding:15px;
    margin-top:30px;
`;

const To = styled.div`
`;

const From = styled.div`
`;

const Price = styled.div`
`;

const Date = styled.div`
`;


HistoryDetail.contextTypes = {
    drizzle: PropTypes.object
}

const mapStateToProps = state => {
    return {
        deedIPFSToken: state.contracts.DeedIPFSToken,
        accounts: state.accounts,
        drizzleStatus: state.drizzleStatus
    }
}

export default drizzleConnect(HistoryDetail, mapStateToProps)