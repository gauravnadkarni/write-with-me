'use client'

import React from 'react'
import { DndProvider as ReactDndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'

export function DndProvider({ children }: { children: React.ReactNode }) {
  // Use HTML5Backend directly to avoid complications
  return <ReactDndProvider backend={HTML5Backend}>{children}</ReactDndProvider>
}
