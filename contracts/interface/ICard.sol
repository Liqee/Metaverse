//SPDX-License-Identifier: MIT
pragma solidity 0.8.4;

interface ICard {
    function mint(
        address _user,
        uint256 _tokenId,
        uint256 _amount,
        string memory _uri
    ) external returns (uint256);
}
