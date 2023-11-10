import { useRef } from 'react'

export function useIsFisrtRender() {
  const isFirst = useRef(true)
  if (isFirst.current) {
    isFirst.current = false

    return true
  }
  return isFirst.current
}

import { DependencyList, EffectCallback, useEffect } from 'react'

import { useIsFisrtRender } from './useIsFisrtRender'

export function useUpdateEffect(effect: EffectCallback, deps: DependencyList) {
  const isFisrtRender = useIsFisrtRender()
  useEffect(() => {
    if (!isFisrtRender) {
      return effect()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)
}

import { DependencyList, useCallback, useEffect, useRef, useState } from 'react'

export function useDebounceValue<T>(value: T, delay = 200): T {
  const [debounceValue, setDebounceValue] = useState(value)
  useEffect(() => {
    const timer = setTimeout(() => setDebounceValue(value), delay)
    return () => clearTimeout(timer)
  }, [value, delay])
  return debounceValue
}

export function useDebounce<T extends(...args: any[]) => any>(
  fn: T, dep: DependencyList = [], delay = 100): T {
  const { current } = useRef<{fn: T, timer: any}>({ fn, timer: null })
  useEffect(() => {
    current.fn = fn
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fn])
  // eslint-disable-next-line react-hooks/exhaustive-deps
  return useCallback(((...args) => {
    if (current.timer) {
      clearTimeout(current.timer)
    }
    current.timer = setTimeout(() => {
      current.fn.call(this, ...args)
    }, delay)
  }) as T, dep)
}

