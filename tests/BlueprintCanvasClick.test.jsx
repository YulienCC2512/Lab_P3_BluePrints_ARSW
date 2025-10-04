import { describe, it, expect, vi } from 'vitest'
import { render, fireEvent } from '@testing-library/react'
import BlueprintCanvas from '../src/components/BlueprintCanvas.jsx'

describe('BlueprintCanvas click', () => {
  it('calls onAddPoint with coordinates when clicked', () => {
    const onAddPoint = vi.fn()
    const { container } = render(
      <BlueprintCanvas
        points={[]}
        onAddPoint={onAddPoint}
        width={200}
        height={100}
      />,
    )

    const canvas = container.querySelector('canvas')
    // mock bounding rect
    canvas.getBoundingClientRect = () => ({ left: 0, top: 0 })

    // create a synthetic event with clientX/Y
    fireEvent.click(canvas, { clientX: 12, clientY: 34 })

    expect(onAddPoint).toHaveBeenCalled()
    const arg = onAddPoint.mock.calls[0][0]
    expect(typeof arg.x).toBe('number')
    expect(typeof arg.y).toBe('number')
  })
})
