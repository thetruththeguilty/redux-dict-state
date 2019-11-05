# redux-dict-state
this is a module to define some dict state

## usage

```js

let s1 = createState('someKey')
let s2 = createState('foo')

describe('test createState', () => {

  it('add first state', () => {
    let state1 = s1.reducer(undefined, s1.actions.setState('a', 1, {foo: 1}))
    let state2 = s2.reducer(undefined, s2.actions.setState('a', 1, {foo: 1}))

    expect(state1.getIn(['a', 1], 233)).toEqual({foo: 1})
    expect(state2.getIn(['a', 1], 233)).toEqual({foo: 1})
  })

  it('add and trans', () => {
    let state1 = s1.reducer(undefined, s1.actions.setState('a', 2, {foo: 1}))
    state1 = s1.reducer(state1, s1.actions.setState('a', 2, (v) => { return { foo: v.foo + 1 } }))

    expect(state1.getIn(['a', 2], 233)).toEqual({foo: 2})
  })

  it('add to others', () => {
    let state1 = s1.reducer(undefined, s2.actions.setState('a', 1, {foo: 1}))
    expect(state1.getIn(['a', 1], 233)).toEqual(233)
  })
})
```