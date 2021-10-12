import { useRef, useContext, useEffect } from 'react';
import CacheContext from './CacheContext';

function withKeepAlive(OldComponent, { cacheId = window.location.pathname }) {
  return function (props) {
    let { cacheStates, mount } = useContext(CacheContext);
    const divRef = useRef(null);

    useEffect(() => {
      let cacheState = cacheStates[cacheId];
      if (cacheState && cacheState.doms) {
        let doms = cacheState.doms;
        doms.forEach((dom) => divRef.current.appendChild(dom));
      } else {
        mount({ cacheId, reactElement: <OldComponent {...props} /> });
      }
    }, [cacheStates, mount, props]);

    return (
      <div id={`withKeepAlive-${cacheId}`} ref={divRef}>
        {/* 此处需要一个OldComponent渲染出来的真实DOM */}
      </div>
    );
  };
}
export default withKeepAlive;
