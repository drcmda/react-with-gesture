import React, { useState, useRef } from 'react'
import { animate, easeIn, linear, interpolate } from 'popmotion'

const directions = {
  nw: [-1, -1],
  n: [0, -1],
  ne: [1, -1],
  w: [-1, 0],
  e: [1, 0],
  sw: [-1, 1],
  s: [0, 1],
  se: [1, 1]
}

export function DemoDrags({ subject }) {
  const refDemo = useRef()
  const [magnitude, setMagnitude] = useState(60)
  const [timing, setTiming] = useState(20)
  const [duration, setDuration] = useState(500)
  if (!subject) return null
  return (
    <div className="demo-drags">
      <h2 htmlFor="drag-magnitude">Drag simulator</h2>
      <div className="demo-drags/button-grid">
        {Object.keys(directions).map((key) => {
          const vector = directions[key].map((v) => v * magnitude)
          return (
            <button
              key={key}
              className={`demo-drags/button-${key}`}
              onClick={() => {
                if (refDemo.current?.stop) {
                  refDemo.current.stop()
                }
                const offset = (duration - timing) / duration
                refDemo.current = demo(subject, vector, duration, offset)
              }}
            >
              {key}
            </button>
          )
        })}
        <input
          id="drag-magnitude"
          type="number"
          min="3"
          max="60"
          value={magnitude}
          onChange={({ target: { value } }) => setMagnitude(+value)}
        />
      </div>
      <div className="demo-drags/timings">
        <label>
          Drag duration:
          <input
            type="number"
            min="16"
            max="2000"
            value={duration}
            onChange={({ target: { value } }) => setDuration(+value)}
          />
        </label>
        <label>
          Drag end delay (after motion stops):
          <input
            type="number"
            min="0"
            max="1000"
            value={timing}
            onChange={({ target: { value } }) => setTiming(+value)}
          />
        </label>
      </div>
    </div>
  )
}

function demo(target, [byX, byY], duration, offset) {
  const targetRect = target.getBoundingClientRect()
  const startX = targetRect.x + targetRect.width / 2
  const startY = targetRect.y + targetRect.height / 2
  const endX = startX + byX
  const endY = startY + byY

  const mapProgressToCoords = interpolate(
    [0, 1],
    [
      [startX, startY],
      [endX, endY]
    ]
  )

  dispatchAtCoords(target, 'pointerdown', startX, startY)

  let lastValue
  // generates move events, tarries a bit, then dispatches the up event
  return animate({
    to: [0, 1, 1],
    offset: [0, offset, 1],
    ease: [easeIn, linear],
    duration,
    onUpdate: (value) => {
      // avoids dispatch if the position hasn't changed, like the real thing
      if (value === lastValue) return
      lastValue = value
      const [x, y] = mapProgressToCoords(value)
      dispatchAtCoords(target, 'pointermove', x, y)
    },
    onComplete: () => {
      dispatchAtCoords(target, 'pointerup', endX, endY)
    },
    driver: makeTimeoutDriver(4)
  })
}

function dispatchAtCoords(target, name, x, y) {
  const event = document.createEvent('CustomEvent')
  event.initCustomEvent(name, true, true, null)
  event.pointerId = 1
  event.clientX = x
  event.clientY = y
  target.dispatchEvent(event)
}

const makeTimeoutDriver = (interval) => (update) => {
  let timeoutId
  let lastTimestamp = performance.now()
  let isActive = true

  const tick = () => {
    const timestamp = performance.now()
    const delta = timestamp - lastTimestamp
    lastTimestamp = timestamp

    update(delta)

    if (!isActive) return
    timeoutId = setTimeout(tick, interval)
  }

  return {
    start: () => {
      timeoutId = setTimeout(tick, interval)
    },
    stop: () => {
      isActive = false
      clearTimeout(timeoutId)
    }
  }
}
