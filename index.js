"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const i = __importStar(require("immutable"));
const lodash_assign_1 = __importDefault(require("lodash.assign"));
const SET_STATE = 'RDS_setState';
const BATCH_STATE = 'RDS_batchState';
const CLEAR_STATE = 'RDS_clearState';
exports.defaultState = i.Map();
function applyTrans(value, id, trans) {
    if (typeof trans === 'function') {
        if (value)
            return trans(value, id);
        else
            return trans({}, id);
    }
    else if (typeof trans === 'object') {
        return lodash_assign_1.default({}, value, trans);
    }
    return value;
}
function createState(key) {
    return {
        actions: { setState, batchState, clearState, },
        reducer,
    };
    function setState(collectionKey, id, trans) {
        return {
            type: SET_STATE, key,
            payload: { collectionKey, id, trans }
        };
    }
    function batchState(collectionKey, ids, trans) {
        return {
            type: BATCH_STATE, key,
            payload: { collectionKey, ids, trans }
        };
    }
    function clearState(collectionKey) {
        return { type: CLEAR_STATE, key, payload: collectionKey };
    }
    function reducer(state = exports.defaultState, action) {
        if (action.key !== key) {
            return state;
        }
        if (action.type === CLEAR_STATE) {
            if (action.payload) {
                return state.set(action.payload, i.Map());
            }
            return exports.defaultState;
        }
        if (action.type === BATCH_STATE) {
            let { trans, ids, collectionKey } = action.payload;
            let coll = state.get(collectionKey) || i.Map();
            return state.set(collectionKey, coll.withMutations(map => {
                ids.forEach(id => map.update(id, v => applyTrans(v, id, trans)));
            }));
        }
        else if (action.type === SET_STATE) {
            let { trans, id, collectionKey } = action.payload;
            return state.updateIn([collectionKey, id], v => applyTrans(v, id, trans));
        }
        return state;
    }
}
exports.createState = createState;
