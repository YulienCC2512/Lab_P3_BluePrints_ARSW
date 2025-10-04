import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import BlueprintList from '../src/components/BlueprintList.jsx'

describe('BlueprintList', () => {
  it('renders message when empty', () => {
    const { container } = render(<BlueprintList items={[]} onSelect={() => {}} />)
    expect(container.textContent).toMatch(/No hay blueprints/i)
  })

  it('renders items and calls onSelect when button clicked', () => {
    const items = [
      { name: 'bp1', author: 'a', points: [{ x: 1, y: 2 }] },
    ]
    const onSelect = vi.fn()
    render(<BlueprintList items={items} onSelect={onSelect} />)

    expect(screen.getByText('bp1')).toBeInTheDocument()
    fireEvent.click(screen.getByText(/Ver detalle/i))
    expect(onSelect).toHaveBeenCalledWith(items[0])
  })
})
