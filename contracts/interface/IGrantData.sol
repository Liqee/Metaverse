//SPDX-License-Identifier: MIT
pragma solidity 0.8.4;

interface IGrantData {
    struct ClaimData {
        string ipfsHash;
        uint256 tokenId;
        uint256 amount;
        bool claim;
    }

    struct AddClaimData {
        address user;
        string ipfsHash;
        uint256 tokenId;
        uint256 amount;
    }

    function getClaimData(uint256 _batch, address _user)
        external
        view
        returns (ClaimData memory);

    function getAmount(uint256 _batch, address _user)
        external
        view
        returns (uint256);

    function addClaimData(uint256 _bacth, AddClaimData[] memory) external;

    function getBatches() external view returns (uint256[] memory);
}
