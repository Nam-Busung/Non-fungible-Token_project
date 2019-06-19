import { drizzleConnect } from 'drizzle-react'
import History from './History';

const mapStateToProps = state => {
    return {
        deedIPFSToken: state.contracts.DeedIPFSToken,
        accounts: state.accounts,
        drizzleStatus: state.drizzleStatus
    }
}

const HistoryContainer = drizzleConnect(History, mapStateToProps);

export default HistoryContainer
