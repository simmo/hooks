import { readdirSync } from 'fs'
import * as hookExports from '.'

const hooks: string[] = Object.keys(hookExports)
const expectedExports: string[] = readdirSync(__dirname).filter(item =>
  item.startsWith('use')
)

describe('package', () => {
  test.each(expectedExports)('%s is exported', hook => {
    expect(hooks).toContain(hook)
  })
})
