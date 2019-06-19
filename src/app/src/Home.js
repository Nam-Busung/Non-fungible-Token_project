import React, { Component } from 'react'
import styled from "styled-components";
import { Route } from 'react-router'
import { Link } from 'react-router-dom'

import MainContainer from "./MainContainer";
import TokensContainer from "./layouts/tokens/TokensContainer";

import ipfsContainer from "./layouts/ipfs/ipfsContainer";

import { GlobalStyle } from './globalStyles';
import { config } from './constants/general';
import AuctionContainer from './layouts/auction/AuctionContainer';
import TokenDetail from './layouts/tokens/TokenDetail';
import AuctionDetail from './layouts/auction/AuctionDetail';
import HistoryContainer from './layouts/history/HistoryContainer';
import HistoryDetail from './layouts/history/HistoryDetail';

class Home extends Component {
    render() {
        return (
            <div>
                <GlobalStyle/>

                <HeaderContainer>
                    <MainHeader>
                        <LeftContainer>
                            <Link to={"/create"}>
                                <NavMenu>
                                    create
                                </NavMenu>
                            </Link>
                            <Link to={"/artworks"}>
                                <NavMenu>
                                    My Artworks
                                </NavMenu>
                            </Link>
                        </LeftContainer>
                        <MiddleContainer>
                            <Link to={"/"}>
                                <LogoText>
                                    Gallery
                                </LogoText>
                            </Link>
                        </MiddleContainer>
                        <RightContainer>
                            <Link to={"/gallery"}>
                                <NavMenu>
                                    Gallery
                                </NavMenu>
                            </Link>
                            <Link to={"/historys"}>
                                <NavMenu>
                                    History
                                </NavMenu>
                            </Link>
                        </RightContainer>
                    </MainHeader>
                </HeaderContainer>

                <Route exact path={"/"} component={MainContainer}/>
                <Route path={"/create"} component={ipfsContainer}/>
                <Route path={"/artworks"} component={TokensContainer}/>
                <Route path={"/gallery"} component={AuctionContainer}/>
                <Route path={"/historys"} component={HistoryContainer}/>
    
                <Route path={"/artwork/:id"} component={TokenDetail}/>

                <Route path={"/auction/:id"} component={AuctionDetail}/>

                <Route path={"/history/:id"} component={HistoryDetail}/>
            </div>
        );
    }
}

const HeaderContainer = styled.div`
    top: 0;
    left: 0;
    right: 0;
    background-color:white;
    position: sticky;
    z-index:1;
`;

const MainHeader = styled.div`
    display:flex;
    flex-direction:row;
    align-items:center;
    padding: 30px 80px;
    max-height: 65px;
`;
const LeftContainer = styled.div`
    display:flex;
    align-items:center;
    justify-content:center;

    flex: 1;
`;

const MiddleContainer = styled.div`
    display:flex;
    align-items:center;
    justify-content:center;

    font-size: 40px;
`;
const LogoText = styled.div`
    font-family:'Sloop Script';
    font-size:30px;
    color:${config.color.capeCod};
    display:flex;
    flex-direction:column;
    align-items:center;
`
const RightContainer = styled.div`
    display:flex;
    align-items:center;
    justify-content:center;

    flex: 1;
`;

const NavMenu = styled.div`
    display:flex;
    flex-direction: 'row';

    font-family: 'Avenir Next', sans-serif;

    margin-right: 10px;
    margin-left:10px;
`;

export default Home