const CryptoPool = artifacts.require("CryptoPool");

module.exports = function (deployer) {
  deployer.deploy(CryptoPool);
};
