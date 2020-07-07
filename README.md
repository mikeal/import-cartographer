# import-cartographer

Explore the ESM import tree of a file

## Usage

```js
import importer from 'import-cartographer'
// mock compile function
const compile = async name => compileSomeBundle()

const tree = importer(compile)

for await (let [str, location] of tree('./file.js')) {
  if (typeof location === 'string') {
    // local file
  } else {
    location = await location
    // named import, the result comes from the compile function
  }
}
```

Local files are loaded recursively, so a single `tree()` call will follow the entire
local tree only terminating its recursion at each named import.

For every named import, the compile function is only run once and then cached
indefinitely. The same result (most likely a promise from an async function)
of the first named import will be emitted for every subsequent import of that name.

This means you can run `tree()` multiple times on different local files and continue
to get the same cached result for any named imports.

```js
const tree = importer(compile)

const run = async filename => {
  for await (let [str, location] of tree('./file.js')) {
    // do stuff
  }
}
const results = await Promise.all([
  run('./test/test-one.js'),
  run('./test/test-two.js')
])
```

As you can see, you can safely run this concurrently and still be guaranteed to only
run each compile function for a named import once.
