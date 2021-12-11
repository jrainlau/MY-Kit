const infoSelector = require('./infoSelector')
const tplReplacer = require('./tplReplacer')

async function run() {
  const meta = await infoSelector()
  tplReplacer(meta)
}

run()
