const SommeNombres = artifacts.require("SommeNombres");

module.exports = function (deployer) {
  deployer.deploy(SommeNombres, [5, 10, 15]);
};
