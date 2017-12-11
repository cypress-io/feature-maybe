# feature-maybe

```js
const featureMaybe = require('feature-maybe')
// actual feature flags and values
const features = {
  wizard: true,
  mode: 'beast'
}
const feature = featureMaybe(features)
```

To use

```js
// returns Maybe
// http://folktale.origamitower.com/api/v2.0.0/en/folktale.maybe.html
feature('wizard') // Result {...}
```

Let's say you want to do something if `wizard` is enabled

```js
feature('wizard')
  .map(doSomething)
```

If you want to do something if `wizard` is NOT enabled

```js
feature('wizard')
  .orElse(noWizardPath)
```

Actual value is passed into the call back

```js
feature('mode')
  .map(s => console.log('mode is:', s))
// "mode is: beast"
```

All callbacks are synchronous

## Non-existing features

For example, if we ask for non-existent feature "foo"

```js
feature('foo')
  .map(doSomethingForFoo) // NOT called
  .map(doElseForFoo)      // NOT called
  .orElse(nopeNoFoo)      // called
```

## Turned off features

```js
const features = {
  wizard: true,
  mode: 'beast',
  admin: false
}
const feature = featureMaybe(features)
feature('admin')
  .map(...) // NOT called
```

For more info see [spec.js](spec.js)
