const utils = require('../../lib/utils')

describe('atLeastOne', () => {
  test('returns true if input.length > 0', () => {
    expect(utils.atLeastOne([1])).toBe(true)
  })
  test('returns "please choose at least one option" if input.length === 0', () => {
    expect(utils.atLeastOne([])).toBe('please choose at least one option')
  })
})

describe('appendOrWrite', () => {
  test('writes if file does not exist', () => {
    const mockWrite = jest.fn()
    const mockAppend = jest.fn()
    const generator = {
      fs: {
        exists: () => false,
        write: mockWrite,
        append: mockAppend
      }
    }
    utils.appendOrWrite(generator, 'file', 'content')
    expect(mockWrite).toHaveBeenCalledTimes(1)
    expect(mockWrite).toHaveBeenCalledWith('file', 'content')
    expect(mockAppend).toHaveBeenCalledTimes(0)
  })

  test('appends if file exists', () => {
    const mockWrite = jest.fn()
    const mockAppend = jest.fn()
    const generator = {
      fs: {
        exists: () => true,
        write: mockWrite,
        append: mockAppend
      }
    }
    utils.appendOrWrite(generator, 'file', 'content')
    expect(mockAppend).toHaveBeenCalledTimes(1)
    expect(mockAppend).toHaveBeenCalledWith('file', 'content')
    expect(mockWrite).toHaveBeenCalledTimes(0)
  })
})

describe('guessProjectName', () => {
  test('returns cwd if package.json does not exist', () => {
    const spy = jest.spyOn(process, 'cwd')
    spy.mockReturnValue('FAKECWD')
    expect(utils.guessProjectName({
      destinationPath: () => {},
      fs: {
        exists: () => false
      }
    })).toEqual('FAKECWD')
    spy.mockRestore()
  })

  test('returns cwd if package.json[name] is not defined', () => {
    const spy = jest.spyOn(process, 'cwd')
    spy.mockReturnValue('FAKECWD')
    expect(utils.guessProjectName({
      destinationPath: () => {},
      fs: {
        exists: () => true,
        readJSON: () => ({})
      }
    })).toEqual('FAKECWD')
    spy.mockRestore()
  })

  test('returns package.json[name] if package.json exists and has a name attribut', () => {
    expect(utils.guessProjectName({
      destinationPath: () => {},
      fs: {
        exists: () => true,
        readJSON: () => ({ name: 'FAKENAME' })
      }
    })).toEqual('FAKENAME')
  })
})
