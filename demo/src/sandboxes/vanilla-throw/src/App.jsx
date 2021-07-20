import React, { useEffect, useRef, useState } from 'react'
import { inertia } from 'popmotion'
import styler from 'stylefire'
import { DragGesture } from '@use-gesture/vanilla'

import './styles.css'
import { DemoDrags } from './demo-util'

function readyApp() {
  const puck = document.querySelector('.puck')

  const puckStyler = styler(puck)
  const inertiaEnders = []
  const stopInertia = () => {
    while (inertiaEnders.length) inertiaEnders.pop().stop()
  }

  const bounds = document.querySelector('.bounds')
  const xRange = bounds.offsetWidth / 2 - puck.offsetWidth / 2
  const yRange = bounds.offsetHeight / 2 - puck.offsetWidth / 2

  const gesture = new DragGesture(
    puck,
    ({ active, first, offset: [x, y], direction: [dx, dy], velocity: [vx, vy] }) => {
      if (first) {
        stopInertia()
        puck.className += ' active'
      }
      puckStyler.set({ x, y })
      if (!active) {
        puck.className = 'puck'
        console.log('velocity at gesture end', [vx, vy])
        inertiaEnders.push(
          inertia({
            from: x,
            power: 1,
            velocity: dx * vx * 500,
            min: -xRange,
            max: xRange,
            onUpdate: (v) => puckStyler.set('x', v)
          }),
          inertia({
            from: y,
            power: 1,
            velocity: dy * vy * 500,
            min: -yRange,
            max: yRange,
            onUpdate: (v) => puckStyler.set('y', v)
          })
        )
      }
    },
    {
      from: () => [puckStyler.get('x'), puckStyler.get('y')]
    }
  )

  return gesture.destroy.bind(gesture)
}

export default function App() {
  const isMounted = useRef()
  const [puck, setPuck] = useState()
  useEffect(() => {
    const cleanup = isMounted.current && readyApp()
    isMounted.current = true
    return cleanup
  })
  return (
    <div className="flex fill center">
      <div className="bounds">
        <div className="puck" ref={setPuck}></div>
      </div>
      <DemoDrags subject={puck} />
    </div>
  )
}
