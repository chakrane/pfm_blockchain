// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract GestionChaines {

    string public message;

    function setMessage(string memory _msg) public {
        message = _msg;
    }

    function getMessage() public view returns (string memory) {
        return message;
    }

    function concatener(string memory a, string memory b) public pure returns (string memory) {
        return string.concat(a, b);
    }

    function concatenerAvec(string memory autre) public view returns (string memory) {
        return string.concat(message, autre);
    }

    function longueur(string memory s) public pure returns (uint) {
        return bytes(s).length;
    }

    function comparer(string memory a, string memory b) public pure returns (bool) {
        return keccak256(abi.encodePacked(a)) == keccak256(abi.encodePacked(b));
    }
}
