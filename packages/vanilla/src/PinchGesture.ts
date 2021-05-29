import { registerEngine, PinchEngine, pinchConfigResolver } from '@use-gesture/core'
import { UserPinchConfig, Handler, EventTypes } from '@use-gesture/core/types'
import { Recognizer } from './Recognizer'

interface PinchGestureConstructor {
  new <EventType = EventTypes['pinch']>(
    target: EventTarget,
    handler: Handler<'pinch', EventType>,
    config?: UserPinchConfig
  ): PinchGesture
}

export interface PinchGesture extends Recognizer {}

export const PinchGesture: PinchGestureConstructor = function <EventType = EventTypes['pinch']>(
  target: Element,
  handler: Handler<'pinch', EventType>,
  config: UserPinchConfig | {} = {}
) {
  registerEngine('pinch', PinchEngine, pinchConfigResolver)
  return new Recognizer(target, { pinch: handler }, config, 'pinch')
} as any
