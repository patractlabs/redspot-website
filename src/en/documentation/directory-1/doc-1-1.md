## doc-1-1

```javascript
import BN from "bn.js";
import { expect } from "chai";
import { patract, network, artifacts } from "redspot";

const { getContractFactory, getRandomSigner } = patract;
const { api, getSigners } = network;

describe("ERC20", () => {
  after(() => {
    return api.disconnect();
  });

  async function setup() {
    const one = new BN(10).pow(new BN(api.registry.chainDecimals));
    const signers = await getSigners();
    const Alice = signers[0];
    const sender = await getRandomSigner(Alice, one.muln(100));
    const contractFactory = await getContractFactory("erc20", sender);
    const contract = await contractFactory.deploy("new", "1000");
    const abi = artifacts.readAbi("erc20");
    const receiver = await getRandomSigner();

    return { sender, contractFactory, contract, abi, receiver, Alice, one };
  }
```
### Example

#### Example-1

#### Example-2

#### Example-3