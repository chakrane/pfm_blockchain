const PariteVerificateur = artifacts.require("PariteVerificateur");

module.exports = function (deployer) {
  deployer.deploy(PariteVerificateur);
};