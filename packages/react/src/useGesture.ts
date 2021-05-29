import {
  registerEngine,
  DragEngine,
  PinchEngine,
  ScrollEngine,
  WheelEngine,
  MoveEngine,
  HoverEngine,
  dragConfigResolver,
  pinchConfigResolver,
  moveConfigResolver,
  scrollConfigResolver,
  wheelConfigResolver,
  hoverConfigResolver,
  parseMergedHandlers
} from '@use-gesture/core'
import { GestureHandlers, UserGestureConfig } from '@use-gesture/core/types'
import { useRecognizers } from './useRecognizers'

/**
 * @public
 *
 * The most complete gesture hook, allowing support for multiple gestures.
 *
 * @param {GestureHandlers} handlers - an object with on[Gesture] keys containg gesture handlers
 * @param {UseGestureConfig} [config={}] - the full config object
 */
export function useGesture<Config extends UserGestureConfig = UserGestureConfig>(
  _handlers: GestureHandlers,
  _config: Config | {} = {}
) {
  registerEngine('drag', DragEngine, dragConfigResolver)
  registerEngine('pinch', PinchEngine, pinchConfigResolver)
  registerEngine('scroll', ScrollEngine, scrollConfigResolver)
  registerEngine('wheel', WheelEngine, wheelConfigResolver)
  registerEngine('move', MoveEngine, moveConfigResolver)
  registerEngine('hover', HoverEngine, hoverConfigResolver)

  const { handlers, nativeHandlers, config } = parseMergedHandlers(_handlers, _config)
  return useRecognizers<Config>(handlers, config, undefined, nativeHandlers)
}
