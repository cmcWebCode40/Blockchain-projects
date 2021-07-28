//SPDX-License-Identifier:UNLICENSED

pragma solidity ^0.8.4;

// import 'https://github.com/OpenZeppelin/openzeppelin-contracts/blob/v4.1.0/contracts/token/ERC721/ERC721.sol';
// import 'https://github.com/OpenZeppelin/openzeppelin-contracts/blob/v4.1.0/contracts/security/ReentrancyGuard.sol';
// import 'https://github.com/OpenZeppelin/openzeppelin-contracts/blob/v4.1.0/contracts/utils/Counters.sol';


import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";



contract TradingNFT is ReentrancyGuard {
  using Counters for Counters.Counter;
  Counters.Counter private _itemsId;
  Counters.Counter private _soldItemsId;
  
  uint public viewListPrice = 0.01 ether;
  address payable owner;
  
  constructor(){
    owner = payable(msg.sender);
  }
  
  struct TradingItem {
    uint _itemsId;
    uint tokenId;
    uint price;
    bool soldOut;
    address contractAddress;
    address payable seller;
    address payable owner;
  }

  mapping(uint => TradingItem) private eachTradingItem;

  event TradingItemCreated(
    uint indexed _itemsId,
    uint indexed tokenId,
    uint indexed price,
    bool  soldOut,
    address contractAddress,
    address seller,
    address owner
  );

  function getListingPrice() public view returns(uint){
    return viewListPrice;
  }

  function createTradingItem(
    address nftContract,
    uint256 tokenId,
    uint256 price
  ) public payable nonReentrant {
    require(price > 0, 'Price must be greater than 0');
    require(msg.value == viewListPrice, 'value must be equal to 0.01 ethers');

    _itemsId.increment();

    uint256 currentId = _itemsId.current();
    eachTradingItem[currentId] = TradingItem(
      currentId,
      tokenId,
      price,
      false,
      nftContract,
      payable(msg.sender),
      payable(address(0))
    );

    IERC721(nftContract).transferFrom(msg.sender, address(this), tokenId);

    emit TradingItemCreated(
      currentId,
      tokenId,
      price,
      false,
      nftContract,
      msg.sender,
      address(0)
    );
  }


  function createTradeSale(
    address nftContract,
    uint256 itemId
  ) public payable nonReentrant {
    uint price = eachTradingItem[itemId].price;
    uint tokenId = eachTradingItem[itemId].tokenId;
    require(price == msg.value, 'Amount must be equal to selling price');

    IERC721(nftContract).transferFrom(address(this), msg.sender, tokenId);
    eachTradingItem[itemId].seller.transfer(msg.value);
    eachTradingItem[itemId].owner = payable(msg.sender);
    eachTradingItem[itemId].soldOut = true;
    _soldItemsId.increment();
    payable(owner).transfer(viewListPrice);
  }
  
  function getTradingItems() public view returns(TradingItem[] memory){
    uint totalItems = _itemsId.current();
    uint unsoldItems = _itemsId.current() - _soldItemsId.current();
    uint currentIndex = 0;

    TradingItem[] memory items = new TradingItem[](unsoldItems);
    for(uint i = 0; i < totalItems; i++){
      if(eachTradingItem[i + 1].owner == address(0)) {
        uint currentId = i + 1;
        TradingItem storage currentItem = eachTradingItem[currentId];
        items[currentIndex] = currentItem;
        currentIndex += 1;
      }
    }
    return items;

  }

  function getUserNFT() public view returns(TradingItem[] memory) {
    uint totalItem = _itemsId.current();
    uint itemCount = 0;
    uint currentIndex = 0;

    for(uint i = 0; i < totalItem; i++){
      if(eachTradingItem[i +1].owner == msg.sender){
        itemCount += 1;
      }
    }

    TradingItem[] memory items = new TradingItem[](itemCount);
    for(uint i=0; i < totalItem; i++){
      if(eachTradingItem[i+1].owner == msg.sender){
        uint currentId = i +1;
        TradingItem storage currentItem = eachTradingItem[currentId];
        items[currentIndex] = currentItem;
        currentIndex += 1;
      }
    }

    return items;
  }

  function getCreatedItems() public view returns(TradingItem[] memory){
    uint totalItems = _itemsId.current();
    uint itemCount = 0;
    uint currentIndex = 0;

    for(uint i=0;i<totalItems;i++){
      if(eachTradingItem[i+1].seller == msg.sender){
        itemCount +=1;
      }
    }

    TradingItem[] memory items = new TradingItem[](itemCount);
    for (uint i = 0; i < totalItems; i++) {
      if (eachTradingItem[i+1].seller == msg.sender) {
        uint currentId = i +1;
        TradingItem storage currentItem = eachTradingItem[currentId];
        items[currentIndex] = currentItem;
        currentIndex +=1;
      }
    }
    return items;
  }
}