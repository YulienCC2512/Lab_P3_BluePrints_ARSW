import '@testing-library/jest-dom'

// ---- Canvas mock para jsdom ----
// ---- Canvas mock para jsdom ----
(() => {
  const noop = () => {}
  const makeStub = () => ({
    canvas: {},
    fillRect: noop,
    clearRect: noop,
    beginPath: noop,
    moveTo: noop,
    lineTo: noop,
    stroke: noop,
    arc: noop,
    fill: noop,
    strokeRect: noop,
    closePath: noop,
    save: noop,
    restore: noop,
    setTransform: noop,
    translate: noop,
    scale: noop,
    rotate: noop,
    transform: noop,
    drawImage: noop,
    fillText: noop,
    measureText: () => ({ width: 0 }),
    putImageData: noop,
    createLinearGradient: () => ({ addColorStop: noop }),
    createPattern: () => ({}),
    createRadialGradient: () => ({ addColorStop: noop }),
    getImageData: () => ({}),
    getLineDash: () => [],
    setLineDash: noop,
  })

  const orig = HTMLCanvasElement.prototype.getContext

  HTMLCanvasElement.prototype.getContext = function (type) {
    // Try to use original if it exists and works
    if (typeof orig === 'function') {
      try {
        const res = orig.call(this, type)
        if (res) return res
      } catch (e) {
        // ignore and fall back to stub
      }
    }
    return makeStub()
  }
})()
