//SPDX-License-Identifier: MIT
pragma solidity 0.8.4;

import "@openzeppelin/contracts-upgradeable/token/ERC721/extensions/ERC721URIStorageUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";

import "./interface/ICard.sol";
import "./interface/IGrantData.sol";

contract Card is ICard, OwnableUpgradeable, ERC721URIStorageUpgradeable {
    address[] public whitelist;

    mapping(address => uint256) private inWhitelist;

    function initialize() external initializer {
        __Ownable_init();
        __ERC721_init("Liqee Card", "QCard");
        whitelist.push();
    }

    function mint(
        address _user,
        uint256 _tokenId,
        string memory _uri
    ) external override returns (uint256) {
        require(inWhitelist[msg.sender] != 0, "Metaverse: No permission");

        _safeMint(_user, _tokenId);
        _setTokenURI(_tokenId, _uri);
        return _tokenId;
    }

    function addWhitelist(address _address) external onlyOwner {
        require(
            inWhitelist[_address] == 0,
            "Metaverse: Mint whitelist already exists"
        );
        inWhitelist[_address] = whitelist.length;
        whitelist.push(_address);
    }

    function subWhitelist(address _address) external onlyOwner{
        uint256 index = inWhitelist[_address];
        if (index == 0) {
            return;
        }
        inWhitelist[_address] = 0;
        delete whitelist[index];
    }

    function getWhitelist() public view returns (address[] memory) {
        return whitelist;
    }

    function getWhiteListStatus(address _address)
        public
        view
        returns (uint256)
    {
        return inWhitelist[_address];
    }
}
