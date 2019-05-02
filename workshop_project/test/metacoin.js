const MetaCoin = artifacts.require("MetaCoin");

contract("MetaCoin", accounts => {

  it("should have name MetaCoin", async () => {
    const instance = await MetaCoin.deployed();
    const name = await instance.name();
    assert.equal(name.valueOf(), "MetaCoin", "name was not MetaCoin");
  });

  it("should have symbol MTC", async () => {
    const instance = await MetaCoin.deployed();
    const symbol = await instance.symbol();
    assert.equal(symbol.valueOf(), "MTC", "symbol was not MTC");
  });

  it("should not allow sending > source account balance", async () => {

    const instance = await MetaCoin.deployed();
    const balanceStart = await instance.getBalance.call(accounts[0]);
    const tx = await instance.sendCoin(accounts[1], balanceStart.valueOf()+1, { from: accounts[0] });
    assert.empty(tx.logs);
    
    const balanceEnd = await instance.getBalance.call(accounts[0]);

    //Check balance unchanged, note all values used in solidity are big numbers
    //so to compare numbers we need to call toNumber
    assert.equal(balanceEnd.toNumber(), balanceStart.toNumber(), "eth was sent even though balance exceeded");
  });

  it("should put 10000 MetaCoin in the first account", async () => {
    const instance = await MetaCoin.deployed();
    const balance = await instance.getBalance.call(accounts[0]);
    assert.equal(balance.valueOf(), 10000, "10000 wasn't in the first account");
  });

  it("should send coin correctly", async () => {
    const instance = await MetaCoin.deployed();

    const account1 = accounts[0];
    const account2 = accounts[1];

    // get initial balances
    const initBalance1 = await instance.getBalance.call(account1);
    const initBalance2 = await instance.getBalance.call(account2);

    // send coins from account 1 to 2
    const amount = 10;
    await instance.sendCoin(account2, amount, { from: account1 });

    // get final balances
    const finalBalance1 = await instance.getBalance.call(account1);
    const finalBalance2 = await instance.getBalance.call(account2);

    assert.equal(
      finalBalance1.toNumber(),
      initBalance1.toNumber() - amount + 1, // sender was also paid one since they are the instructor
      "Amount wasn't correctly taken from the sender",
    );
    assert.equal(
      finalBalance2.toNumber(),
      initBalance2.toNumber() + (amount-1),
      "Amount wasn't correctly sent to the receiver",
    );
  });
});
