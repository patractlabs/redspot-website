## @redspot/chai

It provides a set of matchers for contract testing

### Installation

```bash
yarn add @redspot/chai
```

And add the following statement to your `redspot.config.ts`:

```javascript
import "@redspot/chai";
```

### Tasks

This plugin creates no additional tasks.

### Environment extensions

This plugin does not extend the environment.

### Usage

Comparison of Equivalence. This matcher will call the internal eq function for comparison.

```javascript
expect(new BN(1000)).to.equal(1000) // true
```

Check Balance

```javascript
await expect(() =>
  contract.tx.transfer(receiver.address, 7)
).to.changeTokenBalance(contract, receiver, 7);

await expect(() =>
  contract.tx.transfer(receiver.address, 7)
).to.changeTokenBalances(contract, [contract.signer, receiver], [-7, 7]);
```

Contract Events

```javascript
await expect(contract.tx.transfer(receiver.address, 7))
    .to.emit(contract, 'Transfer')

await expect(contract.tx.transfer(receiver.address, 7))
    .to.emit(contract, 'Transfer')
    .withArgs(sender.address, receiver.address, 7);

await expect(
  contract.tx.transfer(sender.address, 7, {
    signer: emptyAccount
  })
).to.not.emit(contract, 'Transfer');
```