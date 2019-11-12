import * as i from 'immutable'
import assign from 'lodash.assign'

const SET_STATE = 'RDS_setState'
const BATCH_STATE = 'RDS_batchState'
const CLEAR_STATE = 'RDS_clearState'

type TDictState = i.Map<string, i.Map<string | number, any>>
type TTrans = {[i: string]: any} | ((param: {[i: string]: any}, id?: any) => {[i: string]: any})
type TSetAction = { type: 'RDS_setState', key: string, payload: { collectionKey: string, id: any, trans: TTrans } }
type TBatchAction = { type: 'RDS_batchState', key: string, payload: { collectionKey: string, ids: any[], trans: TTrans } }
type TClearAction = { type: 'RDS_clearState', key: string, payload?: string }

export const defaultState: TDictState = i.Map()

function applyTrans(value: any, id: any, trans: TTrans) {
  if (typeof trans === 'function') {
    if (value) return trans(value, id)
    else return trans({}, id)
  }
  else if (typeof trans === 'object') {
    return assign({}, value, trans)
  }
  return value
}

export function createState(key: string) {

  return {
    actions: { setState, batchState, clearState, },
    reducer, defaultState,
  }

  function setState(collectionKey: string, id: any, trans: TTrans): TSetAction {
    return {
      type: SET_STATE, key,
      payload: { collectionKey, id, trans }
    }
  }

  function batchState(collectionKey: string, ids: any[], trans: TTrans) {
    return {
      type: BATCH_STATE, key,
      payload: { collectionKey, ids, trans }
    }
  }

  function clearState(collectionKey?: string): TClearAction {
    return { type: CLEAR_STATE, key, payload: collectionKey }
  }

  function reducer(
    state: TDictState = defaultState,
    action: TSetAction | TBatchAction | TClearAction
  ) {

    if (action.key !== key) {
      return state
    }

    if (action.type === CLEAR_STATE) {
      if (action.payload) {
        return state.set(action.payload, i.Map<string | number, any>())
      }
      return defaultState
    }
    if (action.type === BATCH_STATE) {
      let { trans, ids, collectionKey } = action.payload
      let coll = state.get(collectionKey) || i.Map<string | number, any>()
      return state.set(collectionKey, coll.withMutations(map => {
        ids.forEach(id => map.update(id, v => applyTrans(v, id, trans)))
      }))
    }
    else if (action.type === SET_STATE) {
      let { trans, id, collectionKey } = action.payload
      return state.updateIn([collectionKey, id], v => applyTrans(v, id, trans))
    }
    return state
  }
}