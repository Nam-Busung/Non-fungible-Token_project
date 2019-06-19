import React, { Component } from 'react'
import PropTypes from 'prop-types';
import styled from "styled-components";
import ipfs from '../../utils/ipfs';
import { drizzleConnect } from 'drizzle-react'
import { BASE_URI } from '../../constants/general';
import axios from "axios";
import moment from 'moment';
import Image from '../../components/DataDisplay/Image';
import Input from '../../components/DataEntry/Input';
import StateButton, { ButtonState } from '../../components/Button/StateButton';

class AuctionDetail extends Component {

    constructor(props, context) {
        super(props);
        const { item } = this.props.location;

        this.state = {
            bid:0,
            maxBid:(item.bid || {}).price || 0,
            isBidding:false,
            isEnding:false
        }

        this.contracts = context.drizzle.contracts;
        this.deedIPFSToken = this.contracts.DeedIPFSToken;
    }
    bought = false;


    componentWillMount() {
    }

    componentDidMount() {
        this.deedIPFSToken.events.Transfer().on("data", (event) => {
            if(!this.bought) {
                this.bought = true;
                const { id } = this.props.match.params;
                const { accounts } = this.props;
                const { item } = this.props.location;

                const endpoint = BASE_URI + 'endAuction';

                axios.post(endpoint, {
                    auctionId:id,
                    fromId:accounts[0],
                    toId:item.bid.userId,
                    price:item.bid.price,
                    tokenId:item.tokenId
                })
                .then( response => {
                    this.setState({ isEnding:false });
                })
                .catch( err => {
                    console.log(err);
                    this.setState({ isEnding:false });
                });

                this.setState({ isEnding:false });
                alert('success');
                this.props.history.push('/artworks');
            }
        });
    }

    onInputChange = (e) => {
        e.preventDefault();
        let state = {};
        state[e.target.id] = e.target.value;
        this.setState(state);
    }

    onBid = () => {
        let { bid, maxBid } = this.state;
        bid = Number(bid); maxBid = Number(maxBid);
        const { id } = this.props.match.params;
        const { item } = this.props.location;
        const { accounts } = this.props

        if(bid <= maxBid) {
            alert('bid should be bigger then previous bid');
        } else if(bid < Number(item.price)) {
            alert('bid should be bigger then item price');
        } else {

            const endpoint = BASE_URI + 'bid';
        
            this.setState({ isBidding:true });
            axios.post(endpoint, {
                auctionId:id,
                userId:accounts[0],
                tokenId:item.id,
                price:bid
             })
            .then( response => {
                this.setState({ isBidding:false, bid:0 , maxBid:response.data.bidPrice });
            })
            .catch( err => {
                console.log(err);
                this.setState({ isBidding:false });
            });
        }
    }

    endAuction = async () => {
        const { accounts } = this.props
        const { item } = this.props.location;

        if(!item.bid) {
            alert('there is no bid');

            return;
        }
        
        await this.deedIPFSToken.methods.transferFrom.cacheSend(accounts[0], item.bid.userId, item.tokenId);
        this.setState({ isEnding:true });
    }

    render() {
        const { item } = this.props.location;
        const { bid, isBidding, maxBid, isEnding } = this.state;

        return (
            <Container>
                <Image src={item.image}/>
                <Title>
                    Title: {item.title}
                </Title>
                <DescripTion>
                    Description: {item.description}
                </DescripTion>
                <Price>
                    Price: {item.price}
                </Price>
                <Due>
                    Due: {moment.unix(item.due).format('YYYY.MM.DD')}
                </Due>
                <CurrentBid>
                    Current bid: {maxBid}
                </CurrentBid>
                {item.userId !== this.props.accounts[0] &&
                    <BidContainer>
                        <Input
                            id={'bid'} 
                            value={bid} 
                            label={''}
                            onChange={this.onInputChange}
                        />
                        <StateButton
                            onClick={this.onBid}
                            buttonState={isBidding ? ButtonState.loading : ButtonState.idle}
                        >
                            Bid!
                        </StateButton>
                    </BidContainer>
                }
                {item.userId === this.props.accounts[0] &&
                    <BidContainer>
                        <StateButton
                            onClick={this.endAuction}
                            buttonState={isEnding ? ButtonState.loading : ButtonState.idle}
                        >
                            End Auction
                        </StateButton>
                    </BidContainer>
                }
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

const Title = styled.div`
`;

const DescripTion = styled.div`
`;

const Price = styled.div`
`;

const Due = styled.div`
`;

const CurrentBid = styled.div`
`;

const BidContainer = styled.div`
`;


AuctionDetail.contextTypes = {
    drizzle: PropTypes.object
}

const mapStateToProps = state => {
    return {
        deedIPFSToken: state.contracts.DeedIPFSToken,
        accounts: state.accounts,
        drizzleStatus: state.drizzleStatus
    }
}

export default drizzleConnect(AuctionDetail, mapStateToProps)