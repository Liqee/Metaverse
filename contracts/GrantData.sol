//SPDX-License-Identifier: MIT
pragma solidity 0.8.4;

import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/cryptography/MerkleProofUpgradeable.sol";

import "./interface/ICard.sol";

contract GrantData is OwnableUpgradeable {
    mapping(uint256 => bytes32) public merkleRoot;
    mapping(uint256 => mapping(address => bool)) public claims;

    address public card;
    uint256 public totalBatches;

    event Claim(
        uint256 indexed _batch,
        uint256 indexed _tokenId,
        address _recipient
    );

    event AddClaim(uint256 indexed _batch, bytes32 _merkleRoot);

    event UpdateMerkleRoot(
        uint256 indexed _batch,
        bytes32 _oldMerkleRoot,
        bytes32 _newMerkleRoot
    );

    event AddNextId(uint256 _old, uint256 _new);

    constructor(address _card) {
        initialize(_card);
    }

    function initialize(address _card) public initializer {
        card = _card;
        totalBatches = 1;
        __Ownable_init();
    }

    function claim(
        uint256 _batch,
        bytes32[] memory _proof,
        address _recipient,
        uint256 _tokenId,
        uint256 _amount,
        string memory _ipfsHash
    ) external returns (uint256) {
        _claim(_batch, _proof, _recipient, _tokenId, _amount, _ipfsHash);
        return _tokenId;
    }

    function _claim(
        uint256 _batch,
        bytes32[] memory _proof,
        address _recipient,
        uint256 _amount,
        uint256 _tokenId,
        string memory _ipfsHash
    ) internal {
        require(
            !claims[_batch][_recipient],
            "You have already claimed your rewards."
        );

        require(
            _verifyProof(
                _batch,
                _proof,
                _recipient,
                _amount,
                _tokenId,
                _ipfsHash
            ),
            "The proof could not be verified."
        );

        claims[_batch][_recipient] = true;
        ICard(card).mint(_recipient, _tokenId, _amount, _ipfsHash);

        emit Claim(_batch, _tokenId, _recipient);
    }

    function verifyProof(
        uint256 _batch,
        bytes32[] memory _proof,
        address _recipient,
        uint256 _amount,
        uint256 _tokenId,
        string memory _ipfsHash
    ) external view returns (bool) {
        return
            _verifyProof(
                _batch,
                _proof,
                _recipient,
                _amount,
                _tokenId,
                _ipfsHash
            );
    }

    /// @notice Returns whether the recipient can claim
    function _verifyProof(
        uint256 _batch,
        bytes32[] memory _proof,
        address _recipient,
        uint256 _amount,
        uint256 _tokenId,
        string memory _ipfsHash
    ) internal view returns (bool) {
        bytes32 _data = keccak256(
            abi.encode(_recipient, _amount, _tokenId, _ipfsHash)
        );
        return MerkleProofUpgradeable.verify(_proof, merkleRoot[_batch], _data);
    }

    /** Management function */

    function addClaimData(bytes32 _merkleRoot) external onlyOwner {
        require(merkleRoot[totalBatches] == bytes32(0));
        merkleRoot[totalBatches] = _merkleRoot;

        totalBatches += 1;
        emit AddClaim(totalBatches, _merkleRoot);
    }

    function updateMerkleRoot(uint256 _batch, bytes32 _merkleRoot)
        external
        onlyOwner
    {
        require(merkleRoot[_batch] != bytes32(0));

        bytes32 _old = merkleRoot[_batch];
        merkleRoot[_batch] = _merkleRoot;

        emit UpdateMerkleRoot(_batch, _old, _merkleRoot);
    }
}
