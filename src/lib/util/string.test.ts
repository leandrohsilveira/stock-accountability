import { format } from './string'

describe('format function', () => {
  test('Should replace all arguments in the text', () => {
    const result = format(
      'An {0} text to format {0} with {1} arguments',
      'x',
      'y'
    )

    expect(result).toEqual('An x text to format x with y arguments')
  })
})
