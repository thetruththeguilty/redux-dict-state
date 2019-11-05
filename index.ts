import * as i from 'immutable'
import assign from 'lodash.assign'

const SET_STATE = 'RDS_setState'
const CLEAR_STATE = 'RDS_clearState'

type TDictState = i.Map<string, i.Map<string, any>>
type TTrans = {[i: string]: any} | ((param: {[i: string]: any}) => {[i: string]: any})
type TSetAction = { type: 'RDS_setState', key: string, payload: { collectionKey: string, id: string, trans: TTrans } }
type TClearAction = { type: 'RDS_clearState', key: string }

export const defaultState: TDictState = i.Map()

export function createState(key: string) {

  return {
    actions: { setState, clearState, },
    reducer,
  }

  function setState(collectionKey: string, id: any, trans: TTrans): TSetAction {
    return {
      type: SET_STATE, key,
      payload: { collectionKey, id, trans }
    }
  }

  function clearState(): TClearAction {
    return { type: CLEAR_STATE, key }
  }

  function reducer(
    state: TDictState = defaultState,
    action: TSetAction | TClearAction
  ) {
    if (action.key !== key) {
      return state
    }

    if (action.type === CLEAR_STATE) {
      return defaultState
    }
    else if (action.type === SET_STATE) {
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