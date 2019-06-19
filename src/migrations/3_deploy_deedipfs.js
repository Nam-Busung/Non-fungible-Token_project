const DeedIPFSToken = artifacts.require("DeedIPFSToken");

module.exports = function(deployer) {
    deployer.deploy(DeedIPFSToken);
};
