# feature-maybe

> Functional feature toggles on top of any object

```shell
npm i -D feature-maybe
```

To start, wrap any object using the exported function.

```js
const featureMaybe = require('feature-maybe')
// actual feature flags and values
const features = {
  wizard: true,
  mode: 'beast'
}
const feature = featureMaybe(features)
// feature: string -> Maybe(value)
feature('wizard') // Maybe {...}
// returns Maybe
// http://folktale.origamitower.com/api/v2.0.0/en/folktale.maybe.html
```

## Use

### Get the feature value

Common use 1: get the value of a feature, for example the value of the `mode` feature is "beast". Typically we just get it from the `features` object

```js
console.log(features.mode) // "beast"
```

But what happens when the feature `mode` is disabled? All of the sudden we get

```js
const features = {
  wizard: true,
  mode: false
}
console.log(features.mode) // false
```

Ok, let us delete `mode` property completely from the object (if it is JSON) or comment it out (if it is JavaScript)

```js
const features = {
  wizard: true
  // mode: 'beast'
}
console.log(features.mode) // undefined
```

Hmm, we cannot just use a feature, because the `features.mode` might be invalid. This mens we always have to think about the *default* value whenever we use `features.mode`.

```js
console.log(features.mode || 'normal') // "normal"
```

Even this is tricky because of JavaScript castings.

```js
const features = {
  wizard: true,
  limit: 0 // zero is valid number!
}
console.log(features.mode || 'no limit') // "no limit"
```

How does `Maybe` help here? If we want to get the actual value we need to use method `.getOrElse(<default>)` which does not suffer from `||` type casting.

```js
const features = {
  wizard: true,
  mode: false,
  limit: 0 // zero is valid number!
}
feature = featureMaybe(features)
console.log(feature('limit').getOrElse('no limit')) // 0
console.log(feature('mode').getOrElse('normal')) // "normal"
```

### Pass feature around

If we just pass object property, we must remember to always check the value the same way. Otherwise the outside code will do things differently.

```js
// returns "limit" feature value
function init () {
  const features = {
    limit: 0
  }
  console.log(limit in features ? features.limit : 'no limit')
  return features.limit
}
const limit = init()
console.log(limit || 'no limit here')
// 0
// "no limit here"
```

When we pass wrapped Maybe value around, the checking logic is already encapsulated inside, leading to consistency.

```js
// returns "limit" feature value
function init () {
  const features = {
    limit: 0
  }
  const feature = featureMaybe(features)
  const limit = feature('limit')
  console.log(limit.getOrElse('no limit'))
  return limit
}
const limit = init()
console.log(limit.getOrElse('no limit here'))
// 0
// 0
```

The behavior is consistent.

### Conditional code

Often we are not just interested in printing the value of a feature, but in running some code depending on the feature value. Usually this is simple `if` statement.

Let's say you want to do something if `wizard` is enabled

```js
if (features.wizard) {
  console.log('you are a wizard')
}
```

Nice, except `if (predicate)` suffers from the same shortcuts as getting the value of a feature, while avoiding typecasting obstacles. Let us refactor the above code to be a little bit clearer. We are going to move "if" branch into its own function.

```js
const greetWizard = () =>
  console.log('you are a wizard')
if (features.wizard) {
  greetWizard()
}
```

If we use Maybe then we can call `greetWizard` - just pass whatever function you want to the `.map` method.


```js
const greetWizard = () =>
  console.log('you are a wizard')
feature('wizard')
  .map(greetWizard)
```

If you want to do something if `wizard` is NOT enabled

```js
if (!features.wizard) {
  noWizard()
}
// equivalent
feature('wizard')
  .orElse(noWizard)
```

We can even model `if / else` syntax by using both callbacks

```js
feature('wizard')
  .map(greetWizard)
  .orElse(noWizard)
```

There is one difference between `if` and `.map` code. Actual value of the feature stored inside the Maybe instance is passed into the call back

```js
const features = {
  wizard: true,
  mode: 'beast'
}
const feature = featureMaybe(features)
const printMode = (mode) =>
  console.log('mode is:', mode)
// with "if" we need to remember to pass mode
if (features.mode) {
  printMode(features.mode)
}
// with Maybe it happens automatically
feature('mode')
  .map(printMode)
// "mode is: beast"
```

### Refining feature value

Imagine our feature is a temperature limit. Can we treat positive temperature limit differently from negative temperature or zero? First, we might map degrees from F to C using `.map`

```js
const t = feature('temperature') // Maybe(number)
console.log('Temp is', t.getOrElse('too cold'))
if (t.map(FtoC).getOrElse(0) > 0) {
  console.log('warm!')
}
```

But it is easy to get rid of conditional here. All we need is derive a new Maybe from our existing Maybe `t`. Just return new Maybe from the a callback named `chain`

```js
const t = feature('temperature')
const warmTemp = t.map(FtoC)
  .chain(degrees =>
    degrees > 0 ? Maybe.Just(degrees) : Maybe.Nothing()
  )
```

Note that `warmTemp` is a Maybe itself - if the original temperature value inside `t` was positive, then the `warmTemp` will have that positive temperature (in Celsius).

## Other notes

All callbacks are synchronous

### Non-existing features

For example, if we ask for non-existent feature "foo"

```js
feature('foo')
  .map(doSomethingForFoo) // NOT called
  .map(doElseForFoo)      // NOT called
  .orElse(nopeNoFoo)      // called
```

### Turned off features

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

### Small print

Author: Gleb Bahmutov &lt;gleb@cypress.io&gt; &copy; Cypress.io 2017

License: MIT - do anything with the code, but don't blame us if it does not work.

Support: if you find any problems with this module, email / tweet /
[open issue](https://github.com/cypress-io/feature-maybe/issues) on Github

## MIT License

Copyright (c) 2017 Cypress.io &lt;gleb@cypress.io&gt;

Permission is hereby granted, free of charge, to any person
obtaining a copy of this software and associated documentation
files (the "Software"), to deal in the Software without
restriction, including without limitation the rights to use,
copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the
Software is furnished to do so, subject to the following
conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
OTHER DEALINGS IN THE SOFTWARE.
