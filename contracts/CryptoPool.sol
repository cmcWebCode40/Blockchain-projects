//SPDX-License-Identifier: GL-3.0

pragma solidity >=0.5.0 <=0.9.0;

// pragma experimental ABIEncoderV2;

contract CryptoPool {
    string internal constant ADMIN_PERMISSION =
        "Restricted to Onwer of the contract";
    string internal constant INSUFFICIENT_FUNDS =
        "Amount to stake should be equal to 0.01 Ether";
    string internal constant CONTRACT_OWNER_WARNING =
        "Contract Onwer Can not participate in this action";

    address public contractOwner;

    address payable[] public participants;

    enum LotteryState {
        Open,
        Closed,
        Cancel
    }

    LotteryState public poolState;

    mapping(address => bool) havePlayed;

    constructor() {
        contractOwner = msg.sender;
        poolState = LotteryState.Open;
    }

    event ParticipantLog(address indexed player, uint256 indexed amount);

    modifier AdminAccess() {
        require(msg.sender == contractOwner, ADMIN_PERMISSION);
        _;
    }

    modifier PoolOpen() {
        require(poolState == LotteryState.Open);
        _;
    }

    modifier PoolCancel() {
        require(poolState == LotteryState.Cancel);
        _;
    }

    modifier PoolClosed() {
        require(poolState == LotteryState.Closed);
        _;
    }

    receive() external payable {
        require(msg.value == 0.01 ether, INSUFFICIENT_FUNDS);
        require(msg.sender != contractOwner, CONTRACT_OWNER_WARNING);
        require(!havePlayed[msg.sender], "Have only one slot");
        addPlayerToList(msg.sender, msg.value);
    }

    fallback() external {}

    function addPlayerToList(address _address, uint256 _amount)
        private
        PoolOpen
    {
        participants.push(payable(_address));
        //  havePlayed[_address] = true;
        emit ParticipantLog(_address, _amount);
    }

    // To be Rafactored Using ChainLink VRF..
    // Curerent Random Number is basic and to be used for demonstration

    function generateRandomId() private view returns (uint256) {
        return
            uint256(
                keccak256(
                    abi.encodePacked(
                        block.difficulty,
                        block.timestamp,
                        participants.length
                    )
                )
            );
    }

    function changeContractOwner(address newOnwer) public AdminAccess {
        contractOwner = newOnwer;
    }

    function closedPool() public AdminAccess {
        poolState = LotteryState.Closed;
    }

    function OpenPool() public AdminAccess {
        poolState = LotteryState.Open;
    }

    function getContractBalance() public view returns (uint256) {
        uint256 balance = address(this).balance;
        return balance;
    }

    function getAllCurrentPlayer()
        public
        view
        returns (address payable[] memory)
    {
        return participants;
    }

    function pickWinner() public AdminAccess returns (address winnderAddress) {
        require(participants.length >= 3);

        uint256 randomNumberResult = generateRandomId();

        address payable winner;

        uint256 index = randomNumberResult % participants.length;
        winner = participants[index];
        winner.transfer(getContractBalance());
        participants = new address payable[](0);

        return winner;
    }

    // Add Winnners Logs table
}
