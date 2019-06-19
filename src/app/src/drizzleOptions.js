import DeedToken from "./contracts/DeedToken.json";
import DeedIPFSToken from "./contracts/DeedIPFSToken.json";


const options = {
    web3: {
        block: false,
        fallback: {
            type: "ws",
            url: "ws://127.0.0.1:8545",
        },
    },
    contracts: [DeedToken, DeedIPFSToken],
    events: {
        DeedToken: ["Transfer", "Approval", "ApprovalForAll"],
        DeedIPFSToken: ["Transfer", "Approval", "ApprovalForAll"]
    },
    polls: {
        accounts: 1500,
    },
};

export default options;
