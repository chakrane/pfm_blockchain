// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Convertisseur {

    event EtherConverted(uint etherInput, uint weiOutput);
    event WeiConverted(uint weiInput, uint etherOutput);

    function etherEnWei(uint montantEther) public returns (uint) {
        uint weiResult = montantEther * 1 ether;
        emit EtherConverted(montantEther, weiResult);
        return weiResult;
    }

    function weiEnEther(uint montantWei) public returns (uint) {
        uint etherResult = montantWei / 1 ether;
        emit WeiConverted(montantWei, etherResult);
        return etherResult;
    }
}
