'use client'

import { DragLayerMonitor, useDragLayer, XYCoord } from 'react-dnd'
import { useMemo } from 'react'
import { ItemTypes } from '@/lib/types/dnd-types'
import { FileText } from 'lucide-react'

const layerStyles: React.CSSProperties = {
  position: 'fixed',
  pointerEvents: 'none',
  zIndex: 100,
  left: 0,
  top: 0,
  width: '100%',
  height: '100%',
}

function getItemStyles(
  initialOffset: XYCoord | null,
  currentOffset: XYCoord | null
) {
  if (!initialOffset || !currentOffset) {
    return {
      display: 'none',
    }
  }

  const { x, y } = currentOffset

  const transform = `translate(${x}px, ${y}px)`
  return {
    transform,
    WebkitTransform: transform,
  }
}

export const CustomDragLayer: React.FC = () => {
  // Memoize collector function to prevent unnecessary rerenders
  const collect = useMemo(
    () => (monitor: DragLayerMonitor) => ({
      item: monitor.getItem(),
      itemType: monitor.getItemType(),
      initialOffset: monitor.getInitialSourceClientOffset(),
      currentOffset: monitor.getSourceClientOffset(),
      isDragging: monitor.isDragging(),
    }),
    []
  )

  const { itemType, isDragging, initialOffset, currentOffset } =
    useDragLayer(collect)

  function renderItem() {
    switch (itemType) {
      case ItemTypes.DRAFT:
        return (
          <div className="bg-primary text-primary-foreground p-3 rounded-lg shadow-lg flex items-center gap-2">
            <FileText className="h-4 w-4" />
            <span className="text-sm">Moving draft</span>
          </div>
        )
      default:
        return null
    }
  }

  if (!isDragging) {
    return null
  }

  return (
    <div style={layerStyles}>
      <div style={getItemStyles(initialOffset, currentOffset)}>
        {renderItem()}
      </div>
    </div>
  )
}
