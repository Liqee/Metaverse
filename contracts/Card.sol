//SPDX-License-Identifier: MIT
pragma solidity 0.8.4;

import "@openzeppelin/contracts-upgradeable/token/ERC721/extensions/ERC721URIStorageUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";

import "./interface/ICard.sol";

contract Card is ICard, OwnableUpgradeable, ERC721URIStorageUpgradeable {
    mapping(address => bool) internal whitelist;

    //tokenId => amount
    mapping(uint256 => uint256) internal amounts;

    function initialize() external initializer {
        __Ownable_init();
        __ERC721_init("Liqee Card", "QCard");
    }

    function mint(
        address _user,
        uint256 _tokenId,
        uint256 _amount,
        string memory _uri
    ) external override returns (uint256) {
        require(whitelist[msg.sender], "Card: No permission");
        amounts[_tokenId] = _amount;
        _safeMint(_user, _tokenId);
        _setTokenURI(_tokenId, _uri);
        return _tokenId;
    }

    function addWhitelist(address _address) external onlyOwner {
        require(_address != address(0));
        whitelist[_address] = true;
    }

    function subWhitelist(address _address) external onlyOwner {
        whitelist[_address] = false;
    }

    function getWhitelist(address _address) external view returns (bool) {
        return whitelist[_address];
    }

    function getAmount(uint256 _tokenId) external view returns (uint256) {
        return amounts[_tokenId];
    }
}
