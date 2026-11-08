import { useEffect } from 'react'

const APP_NAME = 'HGuitar'

/** Keeps the browser tab title in sync with the active page. */
export function useDocumentTitle(title?: string | null) {
  useEffect(() => {
    document.title = title ? `${title} · ${APP_NAME}` : APP_NAME
  }, [title])
}
