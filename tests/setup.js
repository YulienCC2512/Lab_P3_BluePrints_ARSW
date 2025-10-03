import '@testing-library/jest-dom'

// ---- Mock del canvas para jsdom ----
// Provee una implementación mínima de getContext para tests
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
  // Intentar usar la implementación original si existe y funciona
    if (typeof orig === 'function') {
      try {
        const res = orig.call(this, type)
        if (res) return res
      } catch (e) {
  // ignorar y usar el stub como fallback
      }
    }
    return makeStub()
  }
})()
