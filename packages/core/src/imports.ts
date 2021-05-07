import { ResolverMap } from './config/resolver'
import { DragEngineConstructor } from './engines/DragEngine/DragEngineCore'
import { HoverEngineConstructor } from './engines/HoverEngine/HoverEngineCore'
import { MoveEngineConstructor } from './engines/MoveEngine/MoveEngineCore'
import { PinchEngineConstructor } from './engines/PinchEngine/PinchEngineCore'
import { ScrollEngineConstructor } from './engines/ScrollEngine/ScrollEngineCore'
import { WheelEngineConstructor } from './engines/WheelEngine/WheelEngineCore'
import { FullGestureState, GestureHandlers, GestureKey, InternalHandlers, UserGestureConfig } from './types'

type GestureEngineConstuctor =
  | DragEngineConstructor
  | ScrollEngineConstructor
  | WheelEngineConstructor
  | PinchEngineConstructor
  | HoverEngineConstructor
  | MoveEngineConstructor

export const EngineMap = new Map<GestureKey, GestureEngineConstuctor>()
export const ConfigResolverMap = new Map<GestureKey, ResolverMap>()

export function registerEngine(action: GestureKey, Engine: GestureEngineConstuctor) {
  EngineMap.set(action, Engine)
}

const RE_NOT_NATIVE = /^on(Drag|Wheel|Scroll|Move|Pinch|Hover)/

function sortHandlers(_handlers: GestureHandlers) {
  const native: any = {}
  const handlers: InternalHandlers = {}
  const actions = new Set()

  for (let key in _handlers) {
    if (RE_NOT_NATIVE.test(key)) {
      actions.add(RegExp.lastMatch)
      // @ts-ignore
      handlers[key] = _handlers[key]
    } else {
      // @ts-ignore
      native[key] = _handlers[key]
    }
  }

  return [handlers, native, actions]
}

type HandlerKey = 'onDrag' | 'onPinch' | 'onWheel' | 'onMove' | 'onScroll' | 'onHover'

function registerGesture(
  actions: Set<unknown>,
  handlers: GestureHandlers,
  handlerKey: HandlerKey,
  key: GestureKey,
  internalHandlers: any,
  config: any
) {
  if (!actions.has(handlerKey)) return

  const startKey = handlerKey + 'Start'
  const endKey = handlerKey + 'End'

  const fn = (state: FullGestureState<GestureKey>) => {
    let memo = undefined
    // @ts-ignore
    if (state.first && startKey in handlers) handlers[startKey](state)
    // @ts-ignore
    if (handlerKey in handlers) memo = handlers[handlerKey](state)
    // @ts-ignore
    if (state.last && endKey in handlers) handlers[endKey](state)
    return memo
  }

  internalHandlers[key] = fn
  config[key] = config[key] || {}
}

export function parseMergedHandlers(mergedHandlers: GestureHandlers, mergedConfig: UserGestureConfig) {
  const [handlers, nativeHandlers, actions] = sortHandlers(mergedHandlers)

  const internalHandlers = {}

  registerGesture(actions, handlers, 'onDrag', 'drag', internalHandlers, mergedConfig)
  registerGesture(actions, handlers, 'onWheel', 'wheel', internalHandlers, mergedConfig)
  registerGesture(actions, handlers, 'onScroll', 'scroll', internalHandlers, mergedConfig)
  registerGesture(actions, handlers, 'onPinch', 'pinch', internalHandlers, mergedConfig)
  registerGesture(actions, handlers, 'onMove', 'move', internalHandlers, mergedConfig)
  registerGesture(actions, handlers, 'onHover', 'hover', internalHandlers, mergedConfig)

  return { handlers: internalHandlers, config: mergedConfig, nativeHandlers }
}
