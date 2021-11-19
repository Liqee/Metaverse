//SPDX-License-Identifier: MIT
pragma solidity 0.8.4;

interface IGrantData {
    struct ClaimData {
        string ipfsHash;
        bool claim;
    }

    struct AddClaimData {
        address user;
        string ipfsHash;
    }

    function getClaimData(uint256 _batch, address _user)
        external
        view
        returns (ClaimData memory);

    function addClaimData(uint256 _bacth, AddClaimData[] memory) external;

    function getBatches() external view returns (uint256[] memory);
}
