import create from '../index.js'

const run = async () => {
  const gen = create(() => {})('/root/import-cartographer/test/fixture/test.js')
  for await (const [key, value] of gen) {
    console.log({key, value})
  }
}
run()
