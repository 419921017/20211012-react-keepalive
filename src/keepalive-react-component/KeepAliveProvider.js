import { useReducer, useCallback } from 'react';
import cacheReducer from './cacheReducer';
import CacheContext from './CacheContext';
import * as cacheTypes from './cacheTypes';

function KeepAliveProvider(props) {
  const [cacheStates, dispatch] = useReducer(cacheReducer, {});

  const mount = useCallback(
    ({ cacheId, reactElement }) => {
      if (!cacheStates[cacheId]) {
        dispatch({
          type: cacheTypes.CREATE,
          payload: { cacheId, reactElement },
        });
      } else {
        let cacheState = cacheStates[cacheId];
        if (cacheState.status === cacheTypes.DESTORY) {
          let doms = cacheState.doms;
          doms.forEach((dom) => dom.parentNode.removeChild(dom));
        }
      }
    },
    [cacheStates]
  );

  const handleScroll = useCallback(
    (cacheId, event) => {
      if (cacheStates[cacheId]) {
        let target = event.target;
        let scrolls = cacheStates[cacheId].scrolls;
        scrolls[target] = target.scrollTop;
      }
    },
    [cacheStates]
  );

  return (
    <CacheContext.Provider
      value={{ cacheStates, dispatch, mount, handleScroll }}
    >
      {props.children}
      {Object.values(cacheStates)
        .filter((cacheState) => cacheState.status !== cacheTypes.DESTORY)
        .map(({ cacheId, reactElement }) => {
          return (
            <div
              id={`cache-${cacheId}`}
              key={cacheId}
              ref={(divDOM) => {
                let cacheState = cacheStates[cacheId];
                if (
                  divDOM &&
                  (!cacheState.doms || cacheState.status === cacheTypes.DESTORY)
                ) {
                  let doms = Array.from(divDOM.childNodes);
                  dispatch({
                    type: cacheTypes.CREATED,
                    payload: { cacheId, doms },
                  });
                }
              }}
            >
              {reactElement}
            </div>
          );
        })}
    </CacheContext.Provider>
  );
}

export default KeepAliveProvider;
