import React from 'react'
import {LavaDome as LavaDomeReact} from "../src/index"

export default function App({secret}) {
    return <LavaDomeReact text={secret} />
}