const VerificateurNombre = artifacts.require("VerificateurNombre");

module.exports = function (deployer) {
  deployer.deploy(VerificateurNombre);
};