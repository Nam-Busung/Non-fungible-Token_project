const DeedToken = artifacts.require("DeedToken");

module.exports = function(deployer) {
    deployer.deploy(DeedToken);
};
