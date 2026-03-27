import { useEffect } from 'react'
import { useSocket as useSocketCtx } from '../context/SocketContext'

export function useSocketEvent(event, handler) {
  const socket = useSocketCtx()

  useEffect(() => {
    socket.on(event, handler)
    return () => socket.off(event, handler)
  }, [event, handler, socket])
}
