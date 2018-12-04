// import Taro from '@tarojs/taro';
import * as indexApi from './service';

export default {
  namespace: 'index',
  state: {
    data: [],
    key: '72eed010c976e448971655b56fc2324e',
    v: '1.0'
  },

  effects: {
    * getLists({ payload }, { select, call, put }) {
      const { key, v } = yield select(state => state.index)
      const { error, result } = yield call(indexApi.getLists, {
        key,
        v,
        ...payload
      })
      if (!error) {
        yield put({
          type: 'updateState',
          payload: {
            data: result
          }
        })
      }
    }
  },

  reducers: {
    updateState(state, { payload: data }) {
      return { ...state, ...data }
    }
  }

}
