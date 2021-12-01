//SPDX-License-Identifier: MIT
pragma solidity 0.8.4;

import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/cryptography/MerkleProofUpgradeable.sol";

import "./interface/ICard.sol";

contract CardManager is OwnableUpgradeable {
    mapping(uint256 => bytes32) public merkleRoot;
    mapping(uint256 => mapping(address => bool)) public claimed;

    address public card;
    uint256 public totalRounds;

    event Claim(
        uint256 indexed _roundID,
        uint256 indexed _tokenId,
        address _recipient
    );

    event AddClaimers(uint256 indexed _roundID, bytes32 _merkleRoot);

    event UpdateMerkleRoot(
        uint256 indexed _roundID,
        bytes32 _oldMerkleRoot,
        bytes32 _newMerkleRoot
    );

    constructor(address _card) {
        initialize(_card);
    }

    function initialize(address _card) public initializer {
        card = _card;
        totalRounds = 1;
        __Ownable_init();
    }

    function claim(
        uint256 _roundID,
        bytes32[] memory _proof,
        address _recipient,
        uint256 _tokenId,
        uint256 _amount,
        string memory _ipfsHash
    ) external returns (uint256) {
        _claim(_roundID, _proof, _recipient, _tokenId, _amount, _ipfsHash);
        return _tokenId;
    }

    function _claim(
        uint256 _roundID,
        bytes32[] memory _proof,
        address _recipient,
        uint256 _amount,
        uint256 _tokenId,
        string memory _ipfsHash
    ) internal {
        require(
            !claimed[_roundID][_recipient],
            "You have already claimed your rewards."
        );

        require(
            _verifyProof(
                _roundID,
                _proof,
                _recipient,
                _amount,
                _tokenId,
                _ipfsHash
            ),
            "The proof could not be verified."
        );

        claimed[_roundID][_recipient] = true;
        ICard(card).mint(_recipient, _tokenId, _amount, _ipfsHash);

        emit Claim(_roundID, _tokenId, _recipient);
    }

    function verifyProof(
        uint256 _roundID,
        bytes32[] memory _proof,
        address _recipient,
        uint256 _amount,
        uint256 _tokenId,
        string memory _ipfsHash
    ) external view returns (bool) {
        return
            _verifyProof(
                _roundID,
                _proof,
                _recipient,
                _amount,
                _tokenId,
                _ipfsHash
            );
    }

    /// @notice Returns whether the recipient can claim
    function _verifyProof(
        uint256 _roundID,
        bytes32[] memory _proof,
        address _recipient,
        uint256 _amount,
        uint256 _tokenId,
        string memory _ipfsHash
    ) internal view returns (bool) {
        bytes32 _data = keccak256(
            abi.encode(_recipient, _amount, _tokenId, _ipfsHash)
        );
        return MerkleProofUpgradeable.verify(_proof, merkleRoot[_roundID], _data);
    }

    /** Management function */

    function addClaimers(bytes32 _merkleRoot) external onlyOwner {
        require(merkleRoot[totalRounds] == bytes32(0));
        merkleRoot[totalRounds] = _merkleRoot;

        totalRounds += 1;
        emit AddClaimers(totalRounds, _merkleRoot);
    }

    function updateMerkleRoot(uint256 _roundID, bytes32 _merkleRoot)
        external
        onlyOwner
    {
        require(merkleRoot[_roundID] != bytes32(0));

        bytes32 _old = merkleRoot[_roundID];
        merkleRoot[_roundID] = _merkleRoot;

        emit UpdateMerkleRoot(_roundID, _old, _merkleRoot);
    }
}
