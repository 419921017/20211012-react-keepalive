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
      }
    },
    [cacheStates]
  );

  return (
    <CacheContext.Provider value={{ cacheStates, dispatch, mount }}>
      {props.children}
      {Object.values(cacheStates).map(({ cacheId, reactElement }) => {
        console.log('cacheId', cacheId);
        console.log('cacheStates', cacheStates);
        return (
          <div
            id={`cache-${cacheId}`}
            key={cacheId}
            ref={(divDOM) => {
              let cacheState = cacheStates[cacheId];
              console.log(cacheState);
              if (divDOM && cacheState && !cacheState.doms) {
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
