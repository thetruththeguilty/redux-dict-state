import * as i from 'immutable'
import assign from 'lodash.assign'

type TDictState = i.Map<string, i.Map<string, any>>
type TTrans = {[i: string]: any} | ((param: {[i: string]: any}) => {[i: string]: any})
type TSetAction = { type: 'setState', key: string, payload: { collectionKey: string, id: string, trans: TTrans } }
type TClearAction = { type: 'clearState', key: string }

export const defaultState: TDictState = i.Map()

export function createState(key: string) {

  return {
    actions: { setState, clearState, },
    reducer,
  }

  function setState(collectionKey: string, id: any, trans: TTrans): TSetAction {
    return {
      type: 'setState', key,
      payload: { collectionKey, id, trans }
    }
  }

  function clearState(): TClearAction {
    return { type: 'clearState', key }
  }

  function reducer(
    state: TDictState = defaultState,
    action: TSetAction | TClearAction
  ) {
    if (action.key !== key) {
      return state
    }

    if (action.type === 'clearState') {
      return defaultState
    }
    else if (action.type === 'setState') {
      let { trans, id, collectionKey } = action.payload
      return state.updateIn([collectionKey, id], v => {
        if (typeof trans === 'function') {
          if (v) return trans(v)
          else return trans({})
        }
        else if (typeof trans === 'object') {
          return assign({}, v, trans)
        }
        return v
      })
    }
    return state
  }
}