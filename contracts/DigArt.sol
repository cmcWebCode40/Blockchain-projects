//SPDX-License-Identifier:GL-3.int208

pragma solidity ^0.8.4;

// import 'https://github.com/OpenZeppelin/openzeppelin-contracts/blob/v4.1.0/contracts/token/ERC721/ERC721.sol';
// import 'https://github.com/OpenZeppelin/openzeppelin-contracts/blob/v4.1.0/contracts/token/ERC721/extensions/ERC721URIStorage.sol';
// import 'https://github.com/OpenZeppelin/openzeppelin-contracts/blob/v4.1.0/contracts/utils/Counters.sol';


import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";


contract DigArtNFt is ERC721URIStorage {
  using Counters for Counters.Counter;
  
  Counters.Counter private _tokenIds;
  address contractAddress;
  
  constructor(address openStoreAddress) ERC721("Dig Art Tokens", "DAT"){
    contractAddress = openStoreAddress;
  }
  
  function createAsset(string memory tokenURI)public returns(uint) {
    _tokenIds.increment();
    uint256 createdTokenId = _tokenIds.current();
    
    _mint(msg.sender, createdTokenId);
    _setTokenURI(createdTokenId, tokenURI);
    setApprovalForAll(contractAddress, true);
    return createdTokenId;
      
  }
    
}