/* eslint-env mocha */
const snapshot = require('snap-shot-it')
const la = require('lazy-ass')
const is = require('check-more-types')
const sinon = require('sinon')

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

  it('maps if existing feature', () => {
    const spy = sinon.spy()
    feature('wizard').map(spy)
    la(spy.calledOnce)
  })

  it('passes value to existing feature', () => {
    const spy = sinon.spy()
    feature('mode')
      .map(value => {
        la(value === 'beast')
      })
      .map(spy)
    la(spy.calledOnce)
  })

  it('calls .orElse for non-existing features', () => {
    const onFeature = sinon.spy()
    const onNoFeature = sinon.spy()
    feature('foo').map(onFeature).orElse(onNoFeature)
    la(!onFeature.called)
    la(onNoFeature.calledOnce)
  })
})
