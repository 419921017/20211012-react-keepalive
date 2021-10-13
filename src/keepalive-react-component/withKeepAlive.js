import { useRef, useContext, useEffect } from 'react';
import CacheContext from './CacheContext';
import * as cacheTypes from './cacheTypes';

function withKeepAlive(
  OldComponent,
  { cacheId = window.location.pathname, scroll = false }
) {
  return function (props) {
    let { cacheStates, dispatch, mount, handleScroll } =
      useContext(CacheContext);
    const divRef = useRef(null);

    useEffect(() => {
      let onScroll = handleScroll.bind(null, cacheId);
      if (scroll) {
        divRef.current.addEventListener(
          'scroll',
          onScroll,
          true // 监听捕获阶段, 滚动事件必须监听捕获, 监听冒泡没有用
        );
      }
      return divRef.current.removeEventListener('scroll', onScroll);
    }, [handleScroll]);

    useEffect(() => {
      let cacheState = cacheStates[cacheId];
      if (
        cacheState &&
        cacheState.doms &&
        cacheState.status !== cacheTypes.DESTORY
      ) {
        let doms = cacheState.doms;
        // dom元素被移动后, 会从原来的节点上消失, dom操作是一个剪切操作
        doms.forEach((dom) => divRef.current.appendChild(dom));
        if (scroll) {
          doms.forEach((dom) => {
            if (cacheState.scrolls[dom]) {
              dom.scrollTop = cacheState.scrolls[dom];
            }
          });
        }
      } else {
        mount({
          cacheId,
          reactElement: <OldComponent {...props} dispatch={dispatch} />,
        });
      }
    }, [cacheStates, mount, props, dispatch]);

    return (
      <div id={`withKeepAlive-${cacheId}`} ref={divRef}>
        {/* 此处需要一个OldComponent渲染出来的真实DOM */}
      </div>
    );
  };
}
export default withKeepAlive;
