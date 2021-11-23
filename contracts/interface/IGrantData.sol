//SPDX-License-Identifier: MIT
pragma solidity 0.8.4;

interface IGrantData {
    struct ClaimData {
        AddClaimData userData;
        bool claim;
        bool has;
    }

    struct AddClaimData {
        address user;
        string ipfsHash;
        uint256 tokenId;
        uint256 amount;
    }

}
