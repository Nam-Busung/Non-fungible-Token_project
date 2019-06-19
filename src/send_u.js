//Metamask account
module.exports = function(callback) {
    web3.eth.getAccounts().then((accounts) => {
        web3.eth.sendTransaction({
            from: accounts[2],
            to: "0xE7071d2087dFD92EF8A75b40d91160C6c702d28A",
            value: web3.utils.toWei("10", "ether")
        }, callback);
    })
        .catch((error) => console.log(error))
    ;
}
