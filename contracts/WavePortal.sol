// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract WavePortal {
    uint256 totalWaves;

    event NewWave(address indexed from, uint256 timestamp, string message);

    // A struct is a custom data type where we customize what we want to hold inside of it
    struct Wave {
        address waver; // The address of the user who waved
        string message; // The message the user sent
        uint256 timestamp; // The timestamp when the user waved
    }

    // variable waves that will store an array of struct
    Wave[] waves;

    constructor() payable {
        console.log("We have been constructed");
    }

    // requires string called _message, message that users sends to us from the frontend!
    function wave(string memory _message) public {
        totalWaves += 1;
        console.log("%s has waved", msg.sender);

        // Store the wave data in the array
        waves.push(Wave(msg.sender, _message, block.timestamp));

        // emit triggers the event
        emit NewWave(msg.sender, block.timestamp, _message);

        uint256 prizeAmount = 0.0001 ether;
        require(
            prizeAmount <= address(this).balance,
            "Trying to withdraw more money than the conctract has."
        );
        (bool success, ) = (msg.sender).call{value: prizeAmount}("");
        require(success, "Failed to withdraw money from contract.");
    }

    // function that will return struct array, waves, to us.
    function getAllWaves() public view returns (Wave[] memory) {
        return waves;
    }

    function getTotalWaves() public view returns (uint256) {
        console.log("We have %d total waves!", totalWaves);
        return totalWaves;
    }
}
