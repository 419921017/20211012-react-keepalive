import * as cacheTypes from './cacheTypes';

function cacheReducer(cacheStates, action) {
  let payload = action.payload;
  let cacheId = payload.cacheId;

  switch (action.type) {
    case cacheTypes.CREATE:
      return {
        ...cacheStates,
        [cacheId]: {
          cacheId,
          reactElement: payload.reactElement,
          status: cacheTypes.CREATE,
          doms: undefined, // 此虚拟dom对应的真实dom, 是个数组
          scrolls: {}, // 滚动信息保存对象, 默认是key滚动的dom, 值是滚动的位置
        },
      };
    case cacheTypes.CREATED:
      return {
        ...cacheStates,
        [cacheId]: {
          ...cacheStates[cacheId],
          status: cacheTypes.CREATED,
          doms: payload.doms, // 此虚拟dom对应的真实dom, 是个数组
        },
      };
    case cacheTypes.DESTORY:
      return {
        ...cacheStates,
        [cacheId]: {
          ...cacheStates[cacheId],
          status: cacheTypes.DESTORY,
        },
      };
    default:
      return cacheStates;
  }
}

export default cacheReducer;
