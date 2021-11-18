//SPDX-License-Identifier: MIT
pragma solidity 0.8.4;

import "@openzeppelin/contracts-upgradeable/token/ERC721/extensions/ERC721URIStorageUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/CountersUpgradeable.sol";

import "./interface/IMetaverse.sol";
import "./interface/IGrantData.sol";

contract Metaverse is
    IMetaverse,
    OwnableUpgradeable,
    ERC721URIStorageUpgradeable
{
    using CountersUpgradeable for CountersUpgradeable.Counter;
    CountersUpgradeable.Counter private tokenIds;

    address public grantData;

    function initialize(address _grantData) external initializer {
        grantData = _grantData;
        __Ownable_init();
        __ERC721_init("Liqee Bond", "LBD");
    }

    function mint(address _user, string memory _uri)
        external
        override
        returns (uint256 _tokenId)
    {
        require(msg.sender == grantData, "Metaverse: No permission");

        tokenIds.increment();
        _tokenId = tokenIds.current();
        _safeMint(_user, _tokenId);
        _setTokenURI(_tokenId, string(abi.encodePacked("ipfs://", _uri)));
    }
}
