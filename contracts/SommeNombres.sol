// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract SommeNombres {

    // Tableau dynamique pour stocker les nombres
    uint[] public nombres;

    // Constructeur pour initialiser le tableau avec des nombres
    constructor(uint[] memory _nombres) {
        nombres = _nombres;
    }

    // Fonction pour ajouter un nombre au tableau
    function ajouterNombre(uint _nombre) public {
        nombres.push(_nombre);
    }

    // Fonction pour obtenir l'élément à un indice donné
    function getElement(uint index) public view returns (uint) {
        require(index < nombres.length, "L'indice n'existe pas dans le tableau.");
        return nombres[index];
    }

    // Fonction pour afficher tout le tableau
    function afficheTableau() public view returns (uint[] memory) {
        return nombres;
    }

    // Fonction pour calculer la somme des nombres dans le tableau
    function calculerSomme() public view returns (uint) {
        uint somme = 0;
        for (uint i = 0; i < nombres.length; i++) {
            somme += nombres[i];
        }
        return somme;
    }
}
