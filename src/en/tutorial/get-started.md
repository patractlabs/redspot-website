# Get started

## Overview

This chapter will get you started using redspot to debug smart contracts on Substrate.

We will cover:

- Install the required components on your computer
- Start a new project with redspot
- Create and test our contracts
- Deploy our contract on a local jupiter node.
- Using redspot to interact with our contracts



## Setup

To follow this tutorial, you will need to set up some stuff on your computer.

### Installing Node.js

We require node `>=12.0`,  if not, you can go to the nodejs website and find out how to install or upgrade.

Or we recommend that you install Node using [nvm](https://github.com/nvm-sh/nvm). Windows users can use [nvm-windows](https://github.com/coreybutler/nvm-windows) instead.

### Substrate Prerequisites

Follow the [official installation steps](https://substrate.dev/docs/en/knowledgebase/getting-started/) from the Substrate Developer Hub Knowledge Base.

```
rustup component add rust-src --toolchain nightly
rustup target add wasm32-unknown-unknown --toolchain nightly
```

### Installing The Jupiter Node

We use [Jupiter](https://github.com/patractlabs/jupiter) as our contract test chain. It has some very convenient optimizations for contracts, such as reducing out-of-block time. To install Jupiter:

```
$ cargo install jupiter-dev --git https://github.com/patractlabs/jupiter --locked --force
```

Run a local node:

```
$ jupiter-dev --dev --execution=Native --tmp
```

Alternatively, you can also use Canvas Node:

```
$ cargo install canvas-node --git https://github.com/paritytech/canvas-node.git --tag v0.1.4 --force --locked
```

### Installing cargo-contract

We need to run the compile command using [Cargo Contract](https://github.com/paritytech/cargo-contract).

You can install the utility using Cargo with:

```bash
$ rustup component add rust-src --toolchain nightly
$ cargo install cargo-contract --vers 0.7.1 --force
```



## Creating a new Redspot project

We'll install Redspot using the `npx` . 

Open a new terminal and run these commands:

```
npx redspot-new erc20
```

This will create a  `erc20` directory in your current directory.



### Redspot's architecture

Redspot is designed around the concepts of **tasks** and **plugins**. The bulk of **Redspot**'s functionality comes from plugins, which as a developer [you're free to choose](/en/plugins/) the ones you want to use.

### Tasks

Every time you're running Redspot from the CLI you're running a task. e.g. `npx redspot compile` is running the `compile` task. To see the currently available tasks in your project, run `npx redspot`. Feel free to explore any task by running `npx redspot help [task]`.

### Plugins

redspot has some plugins installed by default, if you need to install or upgrade them manually, please follow these steps.

For this tutorial we are going to use the `@redspot/patract` and `@redspot/chai` plugins. They'll allow you to interact with Substract contracts and to test your contracts. We'll explain how they're used later on. To install them, in your project directory run:

```text
yarn add @redspot/patract @redspot/chai
```

Add a few lines to your `redspot.config.js` so that it looks like this:

 ```javascript
import { RedspotUserConfig } from 'redspot/types';
import '@redspot/patract';
import '@redspot/chai';

export default {
  ...
} as RedspotUserConfig;
 ```

## Writing and compiling smart contracts

In the default ERC20 template, there is an ERC20 contract. We will not discuss the contract writing in depth. For the contract, please check [ink! document](https://substrate.dev/substrate-contracts-workshop/#/1/introduction).

If you need to upgrade your ink! version, please modify `./contracts/cargo.toml`

#### Writing smart contracts

We use [ink!](https://substrate.dev/substrate-contracts-workshop/#/0/introduction) to write contracts. The contract documents are placed in the `contracts` directory. You are also free to organize your contract code.

#### Compiling contracts

First, make sure you have cargo-contract v0.7.1 installed. 

To compile the contract run `npx redspot compile` in your terminal. The `compile` task is one of the built-in tasks.

```
$ npx redspot compile
✨  Detect contracts: erc20(/home/redspot/workspace/erc20/contracts/Cargo.toml)
...

🚚  Copy wasm files: erc20.wasm
🚚  Copy abi files: /home/redspot/workspace/erc20/contracts/target/erc20.json
🎉  Compile successfully! You can find them at /home/redspot/workspace/erc20/artifact
```

The contract has been successfully compiled and it's ready to be used.

You can find the corresponding wasm and abi files in the artifacts directory.

If you encounter problems with toolchain when compiling the contract, you can change the toolchain used to compile the contract in `redspot.config.ts`

### Testing contracts

Writing automated tests when building smart contracts is of crucial importance.

You can use redspot for contract unit testing.

By default, redspot uses mocha as the testing framework.

#### Start node

Before testing, we need to start a chain of nodes. If you use jupiter, you can start it like this:

```
$ jupiter-dev --dev --execution=Native --tmp
```

By default, a 9944 rpc link port is opened. The same redspot will default to `ws:///127.0.0.1:9944`. 

#### Writing tests

Create a new directory called `tests` inside our project root directory and create a new file called `token.test.ts`.

Let's start with the code below. We'll explain it next, but for now paste this into `token.test.ts`:

```javascript
import { expect } from "chai";
import { network, patract } from "redspot";

const { api, getSigners } = network;

describe("ERC20", () => {
  after(() => {
    return api.disconnect();
  });

  it("Assigns initial balance", async () => {
    const signers = await getSigners();
    const Alice = signers[0];
    const contractFactory = await patract.getContractFactory("erc20", Alice);
    const contract = await contractFactory.deploy("new", "1000");
    const result = await contract.query.balanceOf(Alice.address);
    expect(result.output).to.equal(1000);
  });
});

```

On your terminal run `npx redspot test`. You should see the following output:

```
$ npx redspot test

  ERC20
    ✓ Assigns initial balance (647ms)

  1 passing (657ms)
```

This means the test passed. Let's now explain each line:

```javascript
const signers = await getSigners();
const Alice = signers[0];
```

The Signer in redspot is an object representing a substrate account, which is used to send transactions to contracts and other accounts. It can also be used in polkadot.js, where we use the default account Alice.

```javascript
const contractFactory = await patract.getContractFactory("erc20", Alice);
```

We get the contract factory through the `getContractFactory` function provided by the `@redspot/patract` plugin.

Calling `deploy()` on a `ContractFactory` will start the deployment, and return a `Promise` that resolves to a `Contract`. This is the object that has a method for each of your  contract functions.

```javascript
const result = await contract.query.balanceOf(Alice.address);
```

Once the contract is deployed, we can call our contract methods on `erc20`  and use them to get the balance of the owner account by calling `balanceOf()`.

```javascript
expect(result.output).to.equal(1000);
```

`balanceOf()` should return the entire supply amount. It is 1000.



### Using a different account

If you need to send a transaction from an account (or `Signer` ) other than the default one to test your code, you can use the `connect()` method in your `Contract` to connect it to a different account. Like this:

```javascript
it("Connect Bob", async () => {
  const signers = await getSigners();
  const Alice = signers[0];
  const Bob = signers[1];
  const contractFactory = await getContractFactory("erc20", Alice);
  const contract = await contractFactory.deploy("new", "1000");

  await contract.tx.transfer(Bob.address, 7);

  await contract.connect(Bob).tx.transfer(Alice.address, 6);

  const balance = await contract.query.balanceOf(Bob.address)

  expect(balance.output).to.equal(1);
});
```



### Set gaslimit and value

For `ContractFactory` and `Contract` in `@redspot/patract`, usually the last argument of the function will allow you to set gaslimit and value. Like this:

```javascript
it("Connect Bob", async () => {
  const signers = await getSigners();
  const Alice = signers[0];
  const Bob = signers[1];
  const contractFactory = await getContractFactory("erc20", Alice);
  const contract = await contractFactory.deploy("new", "1000", {
      gasLimit: 10000000000000n,
      value: 10000000000000n
  });

  await contract.tx.transfer(Bob.address, 7, {
      gasLimit: 10000000000000n,
      value: 10000000000000n
  });

  await tx.transfer(Alice.address, 6, {
      gasLimit: 10000000000000n,
      value: 10000000000000n,
     signer: Bob
  });

  const balance = await contract.query.balanceOf(Bob.address)

  expect(balance.output).to.equal(1);
});
```



### Full coverage

Now that we've covered the basics you'll need for testing your contracts, here's a full test suite for the token with a lot of additional information about how to structure your tests. We recommend reading through.



```javascript
import BN from 'bn.js';
import { expect } from 'chai';
import { patract, network, artifacts } from 'redspot';

// patract from @patract/redspot 
const { getContractFactory, getRandomSigner } = patract;

const { api, getSigners } = network;

describe('ERC20', () => {
  after(() => {
    return api.disconnect();
  });
 
  // setup is used for some initial configuration to ensure that the state of the contract is the same each time it is invoked.
  async function setup() {
    // one token
    const one = new BN(10).pow(new BN(api.registry.chainDecimals));
    // Get all signer
    const signers = await getSigners();
    const Alice = signers[0];
    const sender = await getRandomSigner(Alice, one.muln(100));
    const contractFactory = await getContractFactory('erc20', sender);
    const contract = await contractFactory.deploy('new', '1000');
    const abi = artifacts.readAbi('erc20');
    const receiver = await getRandomSigner();

    return { sender, contractFactory, contract, abi, receiver, Alice, one };
  }

  it('Assigns initial balance', async () => {
    const { contract, sender } = await setup();
    const result = await contract.query.balanceOf(sender.address);
    expect(result.output).to.equal(1000);
  });

  it('Transfer adds amount to destination account', async () => {
    const { contract, receiver } = await setup();

    await expect(() =>
      contract.tx.transfer(receiver.address, 7)
    ).to.changeTokenBalance(contract, receiver, 7);

    await expect(() =>
      contract.tx.transfer(receiver.address, 7)
    ).to.changeTokenBalances(contract, [contract.signer, receiver], [-7, 7]);
  });

  it('Transfer emits event', async () => {
    const { contract, sender, receiver } = await setup();

    await expect(contract.tx.transfer(receiver.address, 7))
      .to.emit(contract, 'Transfer')
      .withArgs(sender.address, receiver.address, 7);
  });

  it('Can not transfer above the amount', async () => {
    const { contract, receiver } = await setup();

    await expect(contract.tx.transfer(receiver.address, 1007)).to.not.emit(
      contract,
      'Transfer'
    );
  });

  it('Can not transfer from empty account', async () => {
    const { contract, Alice, one, sender } = await setup();

    const emptyAccount = await getRandomSigner(Alice, one.muln(10));

    await expect(
      contract.tx.transfer(sender.address, 7, {
        signer: emptyAccount
      })
    ).to.not.emit(contract, 'Transfer');
  });
});

```

This is what the output of `npx redspot test` should look like against the full test suite:

### Deploying to a live network

Once you're ready to share your dApp with other people what you may want to do is deploy to a live network. 

Let's create a new directory `scripts` inside the project root's directory, and paste the following into a `deploy.js` file:

```javascript
import { patract, network } from 'redspot';

const { getContractFactory } = patract;
const { createSigner, keyring, api } = network;

const uri =
  'bottom drive obey lake curtain smoke basket hold race lonely fit walk//Alice';

async function run() {
  await api.isReady;

  const signer = createSigner(keyring.createFromUri(uri));
  const contractFactory = await getContractFactory('erc20', signer);

  const balance = await api.query.system.account(signer.address);

  console.log('Balance: ', balance.toHuman());

  const contract = await contractFactory.deployed('new', '1000000', {
    gasLimit: '200000000000',
    value: '10000000000000000',
    salt: '12312'
  });

  console.log('');
  console.log(
    'Deploy successfully. The contract address: ',
    contract.address.toString()
  );

  api.disconnect();
}

run().catch((err) => {
  console.log(err);
});

```

To indicate Redspot to connect to a specific Substrate network when running any tasks, you can use the `REDSPOT_NETWORK` parameter. Like this:

```
$ REDSPOT_NETWORK=<network-name> npx redspot run scripts/deploy.js
```