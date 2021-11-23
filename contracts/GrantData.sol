//SPDX-License-Identifier: MIT
pragma solidity 0.8.4;

import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";

import "./interface/IMetaverse.sol";
import "./interface/IGrantData.sol";

contract GrantData is OwnableUpgradeable, IGrantData {
    address public metaverse;

    // batch num => user => data
    mapping(uint256 => mapping(address => ClaimData)) private batches;

    //Total batches
    uint256 public totalBatches;

    constructor(address _metaverse) {
        initialize(_metaverse);
    }

    function initialize(address _metaverse) public initializer {
        metaverse = _metaverse;
        totalBatches = 1;
        __Ownable_init();
    }

    function claim(uint256 _batch, address _user)
        external
        returns (uint256 _tokenId)
    {
        _tokenId = _claim(_batch, _user);
    }

    function claims(address _user) external {
        (, uint256[] memory _batches) = getClaimDatas(_user);
        for (uint256 i = 0; i < _batches.length; i++) {
            _claim(_batches[i], _user);
        }
    }

    function _claim(uint256 _batch, address _user)
        private
        returns (uint256 _tokenId)
    {
        require(!batches[_batch][_user].claim, "GrantData: Already claim");
        require(batches[_batch][_user].has, "GrantData: non-existent");

        batches[_batch][_user].claim = true;
        _tokenId = IMetaverse(metaverse).mint(
            _user,
            batches[_batch][_user].userData.tokenId,
            batches[_batch][_user].userData.ipfsHash
        );
        emit Claim(_tokenId, _batch, _user);
    }
    function addClaimData(uint256 _bacth, AddClaimData[] memory _datas)
        external
        onlyOwner
    {
        require(
            _bacth <= totalBatches,
            "GrantData: The number of batches must be less than next"
        );
        for (uint256 i = 0; i < _datas.length; i++) {
            require(
                !batches[_bacth][_datas[i].user].has,
                "GrantData: Already added"
            );
            // require(!batches[_bacth][_datas[i].user].claim,"GrantData: Already claimed");

            batches[_bacth][_datas[i].user] = ClaimData({
                userData: _datas[i],
                claim: false,
                has: true
            });
        }
        emit AddClaim(_bacth, _datas.length);
    }

    function addBatches() external onlyOwner {
        uint256 _old = totalBatches;
        totalBatches += 1;
        emit AddNextId(_old, totalBatches);
    }

    function getAmount(uint256 _batch, address _user)
        external
        view
        returns (uint256)
    {
        return batches[_batch][_user].userData.amount;
    }

    function getClaimData(uint256 _batch, address _user)
        public
        view
        returns (ClaimData memory)
    {
        return batches[_batch][_user];
    }

    function getClaimDatas(address _user)
        public
        view
        returns (ClaimData[] memory, uint256[] memory)
    {
        uint256 count;
        for (uint256 i = 1; i <= totalBatches; i++) {
            if (batches[i][_user].has) {
                count++;
            }
        }

        ClaimData[] memory a = new ClaimData[](count);
        //batches array
        uint256[] memory b = new uint256[](count);
        uint256 j;

        for (uint256 i = 1; i <= totalBatches; i++) {
            if (batches[i][_user].has) {
                a[j] = batches[i][_user];
                b[j] = i;
                j++;
            }
        }
        return (a, b);
    }

    event Claim(
        uint256 indexed _tokenId,
        uint256 indexed _batch,
        address _user
    );

    event AddClaim(uint256 indexed _batch, uint256 _amount);

    event AddNextId(uint256 _old, uint256 _new);
}
