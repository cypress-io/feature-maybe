const Maybe = require('folktale/maybe')

const featureMaybe = features => name => {
  if (name in features) {
    return Maybe.Just(features[name])
  }
  return Maybe.Nothing()
}

module.exports = featureMaybe
