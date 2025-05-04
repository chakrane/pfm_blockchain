// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract VerificateurNombre {

    // Fonction pour vérifier si un nombre est positif
    function estPositif(int nombre) public pure returns (bool) {
        return nombre > 0;
    }
}
