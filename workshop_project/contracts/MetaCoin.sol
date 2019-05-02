pragma solidity >=0.4.21 <0.6.0;

// This is a simple example of a coin-like contract.
// It is not standards compatible and cannot be expected to talk to other
// coin/token contracts. If you want to create a standards-compliant
// token, see: https://github.com/ConsenSys/Tokens. Cheers!

contract MetaCoin {
    mapping (address => uint) balances;

    address instructor;

    event Transfer(address indexed _from, address indexed _to, uint256 _value);

    constructor() public {
        balances[msg.sender] = 10000;
        instructor = msg.sender;
    }

    function sendCoin(address receiver, uint amount) public returns(bool sufficient) {
        if (balances[msg.sender] < amount || amount < 1 ) return false;
        balances[msg.sender] -= amount;

        balances[instructor] += 1;
        emit Transfer(msg.sender, instructor, 1);
        amount -= 1;
        if (amount > 0) {
            balances[receiver] += amount;
            emit Transfer(msg.sender, receiver, amount);
        }
        return true;
    }

    function getBalance(address addr) public view returns(uint) {
        return balances[addr];
    }

// Could actually just be public constants no need for a function!
    function name() public view returns (string memory){
        return "MetaCoin";
    }

    function symbol() public view returns (string memory){
        return "MTC";
    }
}
