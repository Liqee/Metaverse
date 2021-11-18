//SPDX-License-Identifier: MIT
pragma solidity 0.8.4;

import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";

import "./interface/IMetaverse.sol";
import "./interface/IGrantData.sol";

contract GrantData is OwnableUpgradeable, IGrantData {
    address public metaverse;

    //batch num => user => ipfs hash
    mapping(uint256 => mapping(address => ClaimData)) private data;

    uint256 public totalBatch;

    function initialize(address _metaverse) external initializer {
        metaverse = _metaverse;
        __Ownable_init();
    }

    function getClaimList(uint256 _batch, address _user)
        public
        view
        override
        returns (ClaimData memory)
    {
        return data[_batch][_user];
    }

    function claim(uint256 _batch) external returns (uint256 tokenId) {
        require(!data[_batch][msg.sender].claim, "GrantData: Already claim");

        data[_batch][msg.sender].claim = true;
        return
            IMetaverse(metaverse).mint(
                msg.sender,
                data[_batch][msg.sender].ipfsHash
            );
    }

    function addClaimData(uint256 _bacth, AddClaimData[] memory _datas)
        external
        override
        onlyOwner
    {
        for (uint256 i = 0; i < _datas.length; i++) {
            AddClaimData memory _addClaimData = _datas[i];
            data[_bacth][_addClaimData.user] = ClaimData({
                ipfsHash: _addClaimData.ipfsHash,
                claim: false
            });
        }
    }
}
