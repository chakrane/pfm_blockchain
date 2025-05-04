// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract PariteVerificateur {

    // Retourne true si le nombre est pair, false sinon
    function estPair(int nombre) public pure returns (bool) {
        return nombre % 2 == 0;
    }

    // Retourne "pair" ou "impair" pour une lecture plus conviviale
    function parite(int nombre) public pure returns (string memory) {
        return nombre % 2 == 0 ? "pair" : "impair";
    }
}
