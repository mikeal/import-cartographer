import acorn from 'acorn'
import { promises as fs } from 'fs'
import { resolve } from 'path'

const parse = acorn.parse
const dirname = str => {
  const i = str.lastIndexOf('/')
  return str.slice(0, i)
}

const create = compile => {
  const named = {}
  const tree = async function * (filename) {
    const text = await fs.readFile(filename)
    const program = parse(text, { sourceType: 'module' })
    const sources = []
    // start the compile functions early
    for (const node of program.body) {
      const key = node.source.value
      if (key.startsWith('.')) {
        const full = resolve(dirname(filename), key)
        sources.push([key, full])
      } else {
        if (!named[key]) named[key] = compile(key)
        yield [key, named[key]]
      }
    }
    yield * sources
    // yield each recurssion serially restrict
    // concurrency to just the compilers.
    for (const [, value] of sources) {
      yield * tree(value)
    }
  }
  tree.named = named
  return tree
}

export default create
