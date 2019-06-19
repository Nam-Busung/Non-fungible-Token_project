import React, { Component } from 'react'
import PropTypes from 'prop-types';
import styled from "styled-components";
import ipfs from '../../utils/ipfs';
import Image from '../../components/DataDisplay/Image';
import Input from '../../components/DataEntry/Input';
import StateButton, { ButtonState } from '../../components/Button/StateButton';
import { drizzleConnect } from 'drizzle-react'
import { BASE_URI } from '../../constants/general';
import DatePicker from "react-datepicker";
import axios from "axios";
import moment from 'moment';

import "react-datepicker/dist/react-datepicker.css";

class TokenDetail extends Component {
    state = {
        imageUrl:'',
        isCreating:false,
        isDeleting:false,

        date: new Date()
    }
    deleted = false;
    startDate = new Date()
    endDate = null

    constructor(props, context) {
        super(props);
        this.contracts = context.drizzle.contracts;
        this.deedIPFSToken = this.contracts.DeedIPFSToken;

        if (this.startDate.getMonth() === 11) {
            this.endDate = new Date(this.startDate.getFullYear() + 1, 0, 1);
        } else {
            this.endDate = new Date(this.startDate.getFullYear(), this.startDate.getMonth() + 1, 1);
        }
    }

    componentWillMount() {
        this.load();
    }

    componentDidMount() {
        //event listening
        this.deedIPFSToken.events.Transfer().on("data", (event) => {
            if(!!this.getHash() && !this.deleted) {
                this.deleted = true;
                this.setState({ isDeleting:false });
                this.props.history.goBack();
            }
        });
    }

    getHash = async () => {
        const { id } = this.props.match.params;
        var ipfsHash;
        try {
            ipfsHash = await this.deedIPFSToken.methods.tokenURI(id).call();
        } catch(e) {
        }
        return ipfsHash;
    }

    load = async () => {
        const { id } = this.props.match.params;
        
        const ipfsHash = await this.getHash();
        if(!ipfsHash) {
            this.deleted = true;
            this.props.history.goBack();
        }
        this.setState({ipfsHash});

        if (await this.deedIPFSToken.methods.ownerOf(id).call() === this.props.accounts[0]) {
            await this.deedIPFSToken.methods.allTokens(id).call();
            this.handleView(ipfsHash);
        }
    }
    
    handleView = async (hash)=> {
        const that =  this;
        
        if (hash !== null) {
            ipfs.cat(hash, function (err, data) {
                if (err) {
                    throw err
                }
                const arrayBufferView = new Uint8Array(data);
                const blob = new Blob( [ arrayBufferView ], { type: "image/jpeg" } );
                const urlCreator = window.URL || window.webkitURL;
                const imageUrl = urlCreator.createObjectURL( blob );
                that.setState({ imageUrl });
            });
        }
    }

    handleUpload = () => {
        const endpoint = BASE_URI + 'createAuction';
        const { title, description, price, date, imageUrl } = this.state;
        const { id } = this.props.match.params;
        const { accounts } = this.props
        const formattedDate = moment(date).format("X");
        
        // Create a root reference
    
        this.setState({ isCreating:true });
        axios.post(endpoint, {
            userId:accounts[0],
            tokenId:id,
            title:title,
            description:description,
            price:price,
            due:formattedDate,
            image:imageUrl || ""
         })
        .then( response => {
            this.setState({ isCreating:false });
            this.props.history.push('/gallery');
        })
        .catch( err => {
            console.log(err);
            this.setState({ isCreating:false });
        });
    }

    handleRemove = async (e) => {
        this.setState({ isDeleting:true });
        const { id } = this.props.match.params;
        await this.deedIPFSToken.methods.burn.cacheSend(id);
    }

    onInputChange = (e) => {
        e.preventDefault();
        let state = {};
        state[e.target.id] = e.target.value;
        this.setState(state);
    }

    handleChange = (date) => {
        this.setState({
           date: date
        });
    }

    render() {
        const { imageUrl, title, description, price, isCreating, isDeleting, date } = this.state;

        return (
            <Container>
                <Image src={imageUrl}/>
                <BottomContainer>
                    <InputsContainer>
                        <Input
                            id={'title'} 
                            value={title} 
                            label={'title'}
                            onChange={this.onInputChange}
                        />
                        <Input
                            id={'description'} 
                            value={description} 
                            label={'description'}
                            multiline={true}
                            onChange={this.onInputChange}
                        />
                        <Input
                            id={'price'} 
                            value={price} 
                            label={'price'}
                            onChange={this.onInputChange}
                        />
                        <DateContainer>
                            <DateText>
                                Due:  
                            </DateText>
                            <DatePicker
                                startDate={this.startDate}
                                endDate={this.endDate}
                                selected={date}
                                onChange={this.handleChange}
                            />
                        </DateContainer>
                    </InputsContainer>
                    <ButtonsContainer>
                        <ButtonContainer>
                            <StateButton
                                onClick={this.handleUpload}
                                buttonState={isCreating ? ButtonState.loading : ButtonState.idle}
                            >
                                Create auction
                            </StateButton>
                        </ButtonContainer>

                        <ButtonContainer>
                            <StateButton
                                onClick={this.handleRemove}
                                buttonState={isDeleting ? ButtonState.loading : ButtonState.idle}
                            >
                                Delete artwork
                            </StateButton>
                        </ButtonContainer>
                    </ButtonsContainer>
                </BottomContainer>
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
const BottomContainer = styled.div`
    display:flex;
    flex-direction:column;
    margin-bottom:60px;
`;

const InputsContainer = styled.div`
    align-self:flex-start;
    margin-top:30px;
`;

const DateContainer = styled.div`
    display:flex;
    justify-content:row;
`;
const DateText = styled.div`
`;

const ButtonsContainer = styled.div`
    margin-top:30px;
`;
const ButtonContainer = styled.div`
    margin-bottom:10px;
`;

TokenDetail.contextTypes = {
    drizzle: PropTypes.object,
    router: PropTypes.shape({
      history: PropTypes.object.isRequired,
    }),
}

const mapStateToProps = state => {
    return {
        deedIPFSToken: state.contracts.DeedIPFSToken,
        accounts: state.accounts,
        drizzleStatus: state.drizzleStatus
    }
}

export default drizzleConnect(TokenDetail, mapStateToProps)