const path = require("path");
var HDWalletProvider = require("truffle-hdwallet-provider");
var infura_apikey = "f751cc42880849ff936939de08483853";
var mnemonic = "elegant another canoe dad safe moon spare grape kick aspect school predict";

module.exports = {
    // See <http://truffleframework.com/docs/advanced/configuration>
    // to customize your Truffle configuration!
    contracts_build_directory: path.join(__dirname, "app/src/contracts"),

    networks: {
        development: {
            host: "localhost",
            port: 8545,
            network_id: "5777"
        },
        ropsten: {
            provider: new HDWalletProvider(mnemonic, "https://ropsten.infura.io/"+infura_apikey),
            network_id: 3
        }
    }
};
