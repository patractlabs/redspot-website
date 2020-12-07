## @redspot/patract

For deploying and invoking contracts

### Installation

```bash
yarn add @redspot/patract
```

And add the following statement to your `redspot.config.ts`:

```javascript
import "@redspot/patract";
```

### Tasks

This plugin creates no additional tasks.

### Environment extensions

This plugin adds a `patract` object to the Redspot Runtime Environment. 

The `patract` object has these properties:

- `Contract`
- `ContractFactory`
- `getContractAt`
- `getContractFactory`
- `getRandomSigner`

### Usage

Deployment Contract

```javascript
const [sender] = await getSigners();
const contractFactory = await patract.getContractFactory('erc20', sender);
const contract = await contractFactory.deploy('new', '1000');
```

Calling Contract

```javascript
const result = await contract.query.balanceOf(sender.address);
```

Executive Contract

```javascript
const result = await contract.tx.transfer(sender.address, 7)
```

Get Contract Events

```
contract.events
```

Estimated gas

```javascript
const gas = contract.estimateGas.transfer(sender.address, 7)
```

Changing the default gaslimit and value

```javascript
const contract = await contractFactory.deploy('new', '1000', {
	gasLimit: ...
	value: ...
	signer: ...
  salt: ...
});

const result = await contract.tx.transfer(sender.address, 7, {
	gasLimit: ...
	value: ...
	signer: ...
})
```