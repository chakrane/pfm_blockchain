// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./Forme.sol";

contract Rectangle is Forme {
    uint public lo;
    uint public la;

    constructor(uint _x, uint _y, uint _lo, uint _la) Forme(_x, _y) {
        lo = _lo;
        la = _la;
    }

    function surface() public view override returns (uint) {
        return lo * la;
    }

    function afficheInfos() public pure override returns (string memory) {
        return "Je suis Rectangle";
    }

    function afficheLoLa() public view returns (uint, uint) {
        return (lo, la);
    }
}
