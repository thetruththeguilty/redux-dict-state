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
exports.defaultState = i.Map();
function createState(key) {
    return {
        actions: { setState, clearState, },
        reducer,
    };
    function setState(collectionKey, id, trans) {
        return {
            type: 'setState', key,
            payload: { collectionKey, id, trans }
        };
    }
    function clearState() {
        return { type: 'clearState', key };
    }
    function reducer(state = exports.defaultState, action) {
        if (action.key !== key) {
            return state;
        }
        if (action.type === 'clearState') {
            return exports.defaultState;
        }
        else if (action.type === 'setState') {
            let { trans, id, collectionKey } = action.payload;
            return state.updateIn([collectionKey, id], v => {
                if (typeof trans === 'function') {
                    if (v)
                        return trans(v);
                    else
                        return trans({});
                }
                else if (typeof trans === 'object') {
                    return lodash_assign_1.default({}, v, trans);
                }
                return v;
            });
        }
        return state;
    }
}
exports.createState = createState;
