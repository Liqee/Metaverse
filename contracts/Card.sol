//SPDX-License-Identifier: MIT
pragma solidity 0.8.4;

import "@openzeppelin/contracts-upgradeable/token/ERC721/extensions/ERC721URIStorageUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";

import "./interface/ICard.sol";

contract Card is ICard, OwnableUpgradeable, ERC721URIStorageUpgradeable {
    mapping(address => bool) public minters;

    //tokenId => amount
    mapping(uint256 => uint256) internal amounts;

    event Mint(address _recipient, uint256 _tokenId, uint256 _amount);

    event AddMinter(address _minter, address _owner);

    event RemoveMinter(address _minter, address _owner);

    function initialize() external initializer {
        __Ownable_init();
        __ERC721_init("Liqee Card", "QCard");
    }

    function mint(
        address _recipient,
        uint256 _tokenId,
        uint256 _amount,
        string memory _uri
    ) external override returns (uint256) {
        require(minters[msg.sender], "Card: No permission");
        amounts[_tokenId] = _amount;
        _safeMint(_recipient, _tokenId);
        _setTokenURI(_tokenId, _uri);

        emit Mint(_recipient, _tokenId, _amount);
        return _tokenId;
    }

    function addMinter(address _address) external onlyOwner {
        require(_address != address(0));
        minters[_address] = true;

        emit AddMinter(_address, owner());
    }

    function removeMinter(address _address) external onlyOwner {
        minters[_address] = false;
        emit RemoveMinter(_address, owner());
    }

    function amount(uint256 _tokenId) external view returns (uint256) {
        return amounts[_tokenId];
    }
}
