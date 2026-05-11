import { useEffect, useLayoutEffect } from 'react'
import { useLocation } from 'react-router'

/**
 * useScrollTop
 * Scrolls the window to the top whenever the route pathname changes.
 * Import and call inside RootLayout or any component that needs it.
 */
export function useScrollTop() {
  const { pathname, hash } = useLocation()

  const runWithoutSmoothScroll = (callback) => {
    const html = document.documentElement
    const body = document.body
    const previousHtmlBehavior = html.style.scrollBehavior
    const previousBodyBehavior = body.style.scrollBehavior

    html.style.scrollBehavior = 'auto'
    body.style.scrollBehavior = 'auto'

    callback()

    requestAnimationFrame(() => {
      html.style.scrollBehavior = previousHtmlBehavior
      body.style.scrollBehavior = previousBodyBehavior
    })
  }

  useEffect(() => {
    if (!('scrollRestoration' in window.history)) return undefined

    const previous = window.history.scrollRestoration
    window.history.scrollRestoration = 'manual'

    return () => {
      window.history.scrollRestoration = previous
    }
  }, [])

  useLayoutEffect(() => {
    runWithoutSmoothScroll(() => {
      if (hash) {
        const element = document.querySelector(hash)
        if (element) {
          element.scrollIntoView({ block: 'start' })
          return
        }
      }

      window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
      document.documentElement.scrollTop = 0
      document.body.scrollTop = 0
      document.scrollingElement?.scrollTo?.({ top: 0, left: 0, behavior: 'instant' })
    })
  }, [pathname, hash])
}
