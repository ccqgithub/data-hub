export default function connectReact({
  store,
  hub,
  storeKey = 'store',
  hubKey = 'hub'
}, React) {

  // connect function
  return function(Compnent) {
    // connected component
    function ConnectComponent(props) {

      if (!props[storeKey]) props[storeKey] = store;
      if (!props[hubKey]) props[hubKey] = store;

      return React.createElement(
        Compnent,
        [props],
        [...props.children]
      );
    }

    return ConnectComponent;
  }
}
