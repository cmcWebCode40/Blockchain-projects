

describe('Dig Art NFT Market Place', () => {
  it('Should create and sale digital assets', async () => {
    const TradingNFT = await ethers.getContractFactory('TradingNFT');
    const tradingNFT = await TradingNFT.deploy();
    tradingNFT.deployed();
    const tradingContractAddress = tradingNFT.address;

    const DigArtNFT = await ethers.getContractFactory('DigArtNFt');
    const digArt = await DigArtNFT.deploy(tradingContractAddress);
    digArt.deployed();
    const digArtContractAddress = digArt.address;

    let viewListPrice = await tradingNFT.getListingPrice();
    viewListPrice = viewListPrice.toString();

    const auctionPrice = ethers.utils.parseUnits('1', 'ether');

    await digArt.createAsset("https://www.firsttoken.com");
    await digArt.createAsset("https://www.secondtoken.com");

    await tradingNFT.createTradingItem(digArtContractAddress, 1, { value: viewListPrice });
    await tradingNFT.createTradingItem(digArtContractAddress, 2, { value: viewListPrice });

    const [_, buyerAddress] = await ethers.getSigners();

    await tradingNFT.connect(buyerAddress).createTradingItem(digArtContractAddress, 1, { value: auctionPrice });

    items = await tradingNFT.getTradingItems();
    items = await Promise.all(items.map(async i => {
      const tokenURI = await digArt.tokenURI(i.tokenId);
      let item = {
        price: i.price.toString(),
        tokenId: i.tokenId.toString(),
        seller: i.seller,
        owner: i.owner,
        tokenURI
      }
      return item;
    }))
    console.log(items);
  })

})