// hacks in progress

function reconfigurationAttack() {
  const test = () => {
    const hostref = document.querySelector("#PRIVATE>span");
    if (hostref.shadowRoot) {
      alert("PWND");
    }
  };
  test();
  setInterval(test, 1000);
  
  // despite the following attempts, I can't find a way to override the property.
  // gotta keep on looking tho. There's a lot of surface there.
  item.child.memoizedProps.unsafeOpenModeShadow = true;
  item.child.pendingProps.unsafeOpenModeShadow = true;
  item.child.return.memoizedProps.unsafeOpenModeShadow = true;
  item.child.return.pendingProps.unsafeOpenModeShadow = true;
  item.memoizedProps.children.props.unsafeOpenModeShadow = true;
}

function poisoningAttack() {
  const hostref = document.querySelector("#PRIVATE>span");
  const item =
    hostref[
      Object.getOwnPropertyNames(hostref).find((a) =>
        a.includes("reactInternal")
      )
    ];

  item.child.memoizedProps.hostRef.current = {};
  item.child._debugNeedsRemount = true;
}
