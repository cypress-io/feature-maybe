/* eslint-env mocha */
const snapshot = require('snap-shot-it')

describe('feature-maybe', () => {
  const featureMaybe = require('.')

  const features = {
    wizard: true,
    mode: 'beast'
  }

  const feature = featureMaybe(features)

  it('returns wizard', () => {
    snapshot(feature('wizard'))
  })

  it('returns mode', () => {
    snapshot(feature('mode'))
  })
})
