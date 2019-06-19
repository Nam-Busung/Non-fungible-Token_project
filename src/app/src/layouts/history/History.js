import React, { Component } from 'react'
import PropTypes from 'prop-types';
import styled from "styled-components";
import ipfs from '../../utils/ipfs';
import { BASE_URI } from '../../constants/general';
import axios from "axios";
import Card from '../../components/DataDisplay/Card';
import Masonry from 'react-masonry-css'
import { Link } from 'react-router-dom'

class History extends Component {
    state = {
        history:[]
    }

    constructor(props, context) {
        super(props);
        
        this.contracts = context.drizzle.contracts;
        this.deedIPFSToken = this.contracts.DeedIPFSToken;
    }
    componentWillUnmount() {
    }

    componentDidMount() {
        this.load();
    }

    load = () => {
        const endpoint = BASE_URI + 'getHistoryList';
    
        axios.get(endpoint)
        .then(({data}) => {
            let filtered = Object.keys(data.data).map((key) => {
                const item = data.data[key];
                this.getHash(key);
                return {...item, id:key};
            });
            this.setState({ history:filtered })
        })
        .catch( err => {
            console.log(err)
        });
    }

    getHash = async (id) => {
        var ipfsHash;
        try {
            ipfsHash = await this.deedIPFSToken.methods.tokenURI(id).call();
            const that = this;
            ipfs.cat(ipfsHash, function (err, data) {
                if (err) {
                    throw err
                }
                const arrayBufferView = new Uint8Array(data);
                const blob = new Blob( [ arrayBufferView ], { type: "image/jpeg" } );
                const urlCreator = window.URL || window.webkitURL;
                const imageUrl = urlCreator.createObjectURL( blob );
                var { history } = that.state
                
                let item = history.find(x => x.id === id);
                if(item) {
                    item.image = imageUrl;
                    that.setState({ history:history });
                }
            });
        } catch(e) {
            console.log("TCL: getHash -> e", e)
        }
        return ipfsHash;
    }

    render() {
        const { history } = this.state;
        const historyView = history.map(each => {
            const to = {
                pathname:`history/${each.id}`,
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
                <MasonryContainer>
                    <Masonry
                        className="my-masonry-grid"
                        columnClassName="my-masonry-grid_column"
                    >
                        {historyView}
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



History.contextTypes = {
    drizzle: PropTypes.object
}

export default History