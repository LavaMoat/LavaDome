import React, { useRef } from 'react'
import { LavaDomeShadow } from "./LavaDomeShadow"

export const LavaDome = ({ text }) => {
  const hostRef = useRef(null)
  return (
    <span ref={hostRef}>
      <LavaDomeShadow text={text} hostRef={hostRef} />
    </span>
  )
};
