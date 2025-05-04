const Payment = artifacts.require("Payment");

module.exports = async function (deployer, network, accounts) {
  // Remplacez par une adresse valide si besoin
  const recipientAddress = accounts[1]; // deuxième compte comme destinataire
  await deployer.deploy(Payment, recipientAddress);
};
