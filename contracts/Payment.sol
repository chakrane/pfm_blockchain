// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Payment {
    // Adresse du destinataire
    address public recipient;

    // Constructeur : initialise le destinataire
    constructor(address _recipient) {
        require(_recipient != address(0), "Adresse invalide");
        recipient = _recipient;
    }

    // Fonction pour recevoir un paiement (doit être payable)
    function receivePayment() public payable {
        require(msg.value > 0, "Le montant doit etre superieur a 0");
    }

    // Fonction pour retirer les fonds du contrat
    function withdraw() public {
        require(msg.sender == recipient, "Vous n'etes pas autorise a retirer");
        payable(recipient).transfer(address(this).balance);
    }

    // Fonction pour consulter le solde du contrat (optionnel)
    function getBalance() public view returns (uint) {
        return address(this).balance;
    }
}
