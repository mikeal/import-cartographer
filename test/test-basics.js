/* globals it */
import create from '../index.js'
import assert from 'assert'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const test = it
const same = assert.deepStrictEqual

const fixture = join(__dirname, 'fixture', 'test.js')

test('base fixture', async () => {
  let count = 0
  const gen = create(async () => {
    count += 1
    return count
  })(fixture)
  const results = [
    { key: 'test', value: 1 },
    { key: 'blah', value: 2 },
    {
      key: './sub.js',
      value: join(__dirname, 'fixture', 'sub.js')
    },
    { key: 'blah', value: 2 }
  ]
  for await (let [key, value] of gen) {
    value = await value
    same({ key, value }, results.shift())
  }
})
