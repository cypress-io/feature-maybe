/* eslint-env mocha */
const snapshot = require('snap-shot-it')
const la = require('lazy-ass')
const is = require('check-more-types')

describe('feature-maybe', () => {
  const featureMaybe = require('.')

  let feature

  it('is a function', () => {
    la(is.fn(featureMaybe))
  })

  beforeEach(() => {
    const features = {
      wizard: true,
      mode: 'beast'
    }

    feature = featureMaybe(features)
  })

  it('returns a function', () => {
    la(is.fn(feature))
  })

  it('returns wizard', () => {
    snapshot(feature('wizard'))
  })

  it('returns mode', () => {
    snapshot(feature('mode'))
  })

  it('does not have feature foo', () => {
    snapshot(feature('foo'))
  })
})
