import React, { Component } from 'react'
import PropTypes from 'prop-types';
import styled from "styled-components";
import Banner from '../../components/DataDisplay/Banner';
import { BASE_URI } from '../../constants/general';
import axios from "axios";
import Card from '../../components/DataDisplay/Card';
import Masonry from 'react-masonry-css'
import { Link } from 'react-router-dom'
import { drizzleConnect } from 'drizzle-react'
import ipfs from '../../utils/ipfs';

class Auction extends Component {
    state = {
        auctions:[]
    }

    constructor(props, context) {
        super(props);
        
        this.contracts = context.drizzle.contracts;
        this.deedIPFSToken = this.contracts.DeedIPFSToken;
    }
    
    componentWillUnmount() {
    }

    async componentDidMount() {
        this.load();
    }

    handleView = async (ipfsHash, t, apr)=> {
        const that =  this;
        
        if (ipfsHash !== null) {
            ipfs.cat(ipfsHash, function (err, data) {
                if (err) {
                    throw err
                }
                const arrayBufferView = new Uint8Array(data);
                const blob = new Blob( [ arrayBufferView ], { type: "image/jpeg" } );
                const urlCreator = window.URL || window.webkitURL;
                const imageUrl = urlCreator.createObjectURL( blob );
                var { auctions } = that.state
                
                let item = auctions.find(x => x.tokenId === t);
                if(item) {
                    item.image = imageUrl;
                    
                    that.setState({ auctions:auctions });
                }
            });
        }
        
    }

    getTokenList = async (event) => {
        let t = 0, apr = 0;
        const totalSupply = await this.deedIPFSToken.methods.totalSupply().call();

        for (let j=0; j<totalSupply; j++) {
            t = await this.deedIPFSToken.methods.tokenByIndex(j).call();
            apr = await this.deedIPFSToken.methods.getApproved(t).call();
            
            const ipfsHash = await this.deedIPFSToken.methods.tokenURI(t).call();
            this.setState({ ipfsHash });
            

            if (await this.deedIPFSToken.methods.ownerOf(t).call() === this.props.accounts[0]) {
                await this.deedIPFSToken.methods.allTokens(t).call();
                this.handleView(ipfsHash, t, apr);
            }
        }
    }

    load = () => {
        const endpoint = BASE_URI + 'getAuctionList';
    
        axios.get(endpoint)
        .then(({data}) => {
            let filtered = Object.keys(data.data).map(key => {
                const item = data.data[key];
                return {...item, id:key};
            });
            this.setState({ auctions:filtered }, async () => {
                await this.getTokenList();
            })
        })
        .catch( err => {
            console.log(err)
        });
    }

    render() {
        const { auctions } = this.state;
        const auctionsView = auctions.map(each => {
            const to = {
                pathname:`auction/${each.id}`,
                item:each
            }
            return (
                <Link
                    key={each.id} 
                    to={to}
                    params={each}
                >
                    <Card
                        containerStyle={{
                            marginBottom:'40px'
                        }}
                        {...each}
                    />
                </Link>
            )
        })

        return (
            <Container>
                <Banner
                    title={'Smart art gallery'}
                    subtitle={''}
                    image={'https://www.castlefineart.com/assets/img/resized/fullscreen/galleries-icc.jpg'}
                    style={{
                        justifyContent:'flex-end',
                        alignItems:'flex-start',
                    }}
                />
                <MasonryContainer>
                    <Masonry
                        className="my-masonry-grid"
                        columnClassName="my-masonry-grid_column"
                    >
                        {auctionsView}
                    </Masonry>
                </MasonryContainer>
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

const MasonryContainer = styled.div`
    padding: 100px 50px;
    width: 100%;
    box-sizing: border-box;
    display:flex;
    justify-content:center;

    @media (max-width: 1024px) {
        padding: 60px 30px;
    }
    @media (max-width: 764px) {
        padding: 40px 20px;
    }
    @media (max-width: 480px) {
        padding: 10px;
    }
`;



Auction.contextTypes = {
    drizzle: PropTypes.object
}

const mapStateToProps = state => {
    return {
        deedIPFSToken: state.contracts.DeedIPFSToken,
        accounts: state.accounts,
        drizzleStatus: state.drizzleStatus
    }
}
export default drizzleConnect(Auction, mapStateToProps);