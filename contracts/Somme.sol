// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Somme {
  uint public number1;
  uint public number2;
  uint public somme;



  constructor() {
    number1 = 10;
    number2 = 44;
  }

  function addition1() public view returns (uint){
    return number1 + number2;
  }

  function addition2(uint a, uint b) public returns (uint){
      somme = a+b;
  }

  function getValue() public view returns (uint){
    return somme;
  }
}
