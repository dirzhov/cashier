import fs from 'fs'
import path from 'path'

export default async () => {
  const coverage = (globalThis as any).__coverage__
  if (!coverage) return

  const file = path.join(
    '.nyc_output',
    `coverage-${Date.now()}.json`
  )

  fs.writeFileSync(file, JSON.stringify(coverage))
}
