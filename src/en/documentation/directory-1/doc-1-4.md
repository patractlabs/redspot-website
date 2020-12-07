## Console

Redspot comes built-in with an interactive JavaScript console. You can use it by running `npx redspot console`:

```
Welcome to Node.js v14.15.1.
Type ".help" for more information.
> 
```

The compile task will be called before opening the console prompt, but you can skip this with the --no-compile parameter.

The execution environment for the console is the same as for tasks. This means the configuration has been processed, and the [Redspot Runtime Environment](#RuntimeEnvironment) initialized and injected into the global scope. For example, that you'll have access in the global scope to the config object:

```
> config
{ 
  defaultNetwork: 'development',
  rust: { toolchain: 'nightly-2020-10-07' },
  
  ...
}
>
```

And the initialized `patract` object if you're using the @redspot/patract plugin:

```
> patract
{ provider:
       
  ...

  },
  ...
>
```

Anything that has been injected into the Redspot Runtime Environment will be available in the global scope. you can also require the RSE explicitly and get autocomplete:

```
> config.i
config.isPrototypeOf

config.ink
```

Redspot's console supports await top-level await (i.e. `console.log(await patract.ready()`)