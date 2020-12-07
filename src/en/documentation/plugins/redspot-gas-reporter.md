## @redspot/jupiter

A Mocha reporter for Redspot test suites. It can print gas usage per unit test.

![image-20201208000110560](https://user-images.githubusercontent.com/7029338/101343840-7700ab00-38e9-11eb-80a0-c6b6d38a9640.png)

### Installation

```bash
yarn add @redspot/gas-reporter
```

And add the following statement to your `redspot.config.ts`:

```javascript
import "@redspot/gas-reporter";
```

### Tasks

This plugin creates no additional tasks.

### Environment extensions

This plugin does not extend the environment.