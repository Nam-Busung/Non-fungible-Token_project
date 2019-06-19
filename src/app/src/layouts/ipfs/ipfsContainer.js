import IpfsImgUpload from './IpfsImgUpload'
import { drizzleConnect } from 'drizzle-react'

const mapStateToProps = state => {
    return {
        deedIPFSToken: state.contracts.DeedIPFSToken,
        accounts: state.accounts,
        drizzleStatus: state.drizzleStatus
    }
}


const ipfsContainer = drizzleConnect(IpfsImgUpload, mapStateToProps);

export default ipfsContainer
