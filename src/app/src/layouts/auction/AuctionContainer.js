import { drizzleConnect } from 'drizzle-react'
import Auction from './Auction';

const mapStateToProps = state => {
    return {
        deedIPFSToken: state.contracts.DeedIPFSToken,
        accounts: state.accounts,
        drizzleStatus: state.drizzleStatus
    }
}


const AuctionContainer = drizzleConnect(Auction, mapStateToProps);

export default AuctionContainer
