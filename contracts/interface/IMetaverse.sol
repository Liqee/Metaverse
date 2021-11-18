//SPDX-License-Identifier: MIT
pragma solidity 0.8.4;

interface IMetaverse {
    function mint(address _user, string memory _uri) external returns (uint256);
}