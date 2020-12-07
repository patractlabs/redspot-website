## Configuration

When Redspot is run, it searches for the closest redspot.config.js file starting from the Current Working Directory. This file normally lives in the root of your project. An empty redspot.config.js is enough for Redspot to work.

The entirety of your Redspot setup (i.e. your config, plugins and custom tasks) is contained in this file

### Available config options

To set up your config, you have to export an object from redspot.config.js.

This object can have the following entries: defaultNetwork, networks, and paths. For example:

```javascript
module.exports = {
  defaultNetwork: "development",
  rust: {
    toolchain: "nightly",
  },
  networks: {
    development: {
      endpoint: "ws://127.0.0.1:9944",
      types: {
        Address: "AccountId",
        LookupSource: "AccountId",
      },
      gasLimit: "400000000000",
      explorerUrl: "https://polkadot.js.org/apps/#/explorer/query/",
    },
    substrate: {
      endpoint: "ws://127.0.0.1:9944",
      gasLimit: "400000000000",
      accounts: ["//Alice"],
      types: {},
    },
  },
  mocha: {
    timeout: 60000,
  },
};
```

You can get your configuration details via [`env.config`](#config).

### defaultNetwork

You can customize which network is used by default when running Redspot by setting the config's `defaultNetwork` field. If you omit this config, its default value is "localhost".

### networks

The `networks` config field is an optional object where network names map to their configuration.

The default localhost network configuration is:

```javascript
{
  localhost: {
    gasLimit: "400000000000",
    accounts: ["//Alice", "//Bob", "//Charlie", "//Dave", "//Eve", "//Ferdie"],
    endpoint: ["ws://127.0.0.1:9944"],
    types: {},
    httpHeaders: {},
    explorerUrl: "https://polkadot.js.org/apps/#/explorer/query/"
  }
}
```

#### [network].gasLimit

This value is used by default when instantiating a contract and invoking a contract transaction.

If this value is too small, you will get a `contracts.OutOfGas` error. The maximum value of gaslimit is `System.MaximumBlockWeight`(In Sustrate, it is `2000000000000`).

#### [network].accounts

The `accounts` should be an array of [suri](https://polkadot.js.org/docs/keyring/start/suri/) or [KeyringPair](https://polkadot.js.org/docs/keyring/start/create#adding-a-pair).

At run time, you can obtain accounts in the form `keyringPair` by `await env.network.provider.getKeyringpairs()`. For details, see [network.provider](#network.provider)

#### [network].endpoint

The endpoint can specify the address of the node to which you want to connect, either `string` or `string[]`

At this time, only WebSockets versions of RPC are supported.

#### [network].types

the `types` are the concepts defined in polkadotjs. If you have any questions about this, you can see it here [types.extend](https://polkadot.js.org/docs/api/start/types.extend). You can also set [network].typesbundle, [network].typesSpec and so on. In general, if you encounter an error that is similar to 'No such variant in enum MultiSignature', ,maybe you should think about adding or removing types `{ Address: "AccountId", LookupSource: "AccountId"}`, see [impact-on-extrinsics](https://polkadot.js.org/docs/api/start/types.extend#impact-on-extrinsics).

#### [network].httpHeaders

This setting will be added to the webSocket connection headers

#### [network].explorerUrl

This setting is currently used with @redspot/patract. After the transaction is inblock, the console will print the link: `explorerUrl + bloackhash`. The default value is https://polkadot.js.org/apps/#/explorer/query/.
