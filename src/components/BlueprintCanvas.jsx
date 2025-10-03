import { useEffect, useRef } from 'react'

export default function BlueprintCanvas({ points = [], width = 520, height = 360, id = 'blueprint-canvas' }) {
  const ref = useRef(null)

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')

    const drawGrid = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.fillStyle = '#0b1220'
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      ctx.strokeStyle = 'rgba(148,163,184,0.15)'
      ctx.lineWidth = 1
      for (let x = 0; x < canvas.width; x += 40) {
        ctx.beginPath()
        ctx.moveTo(x, 0)
        ctx.lineTo(x, canvas.height)
        ctx.stroke()
      }
      for (let y = 0; y < canvas.height; y += 40) {
        ctx.beginPath()
        ctx.moveTo(0, y)
        ctx.lineTo(canvas.width, y)
        ctx.stroke()
      }
    }

    drawGrid()

  // Si no hay puntos, no hay nada más que hacer
    if (!points || points.length === 0) return

  const delay = 150 // ms entre el dibujo de cada segmento/punto
    const timeouts = []

  // Dibujar puntos y segmentos de forma secuencial
    for (let i = 0; i < points.length; i++) {
      const p = points[i]
      const t = setTimeout(() => {
  // dibujar marcador de punto
        ctx.fillStyle = '#fbbf24'
        ctx.beginPath()
        ctx.arc(p.x, p.y, 4, 0, Math.PI * 2)
        ctx.fill()

  // dibujar segmento desde el punto anterior al actual
        if (i > 0) {
          const prev = points[i - 1]
          ctx.strokeStyle = '#93c5fd'
          ctx.lineWidth = 2
          ctx.beginPath()
          ctx.moveTo(prev.x, prev.y)
          ctx.lineTo(p.x, p.y)
          ctx.stroke()
        }
      }, i * delay)

      timeouts.push(t)
    }

  
    const finalTimeout = setTimeout(() => {
      if (points.length > 1) {
        ctx.strokeStyle = '#93c5fd'
        ctx.lineWidth = 2
        ctx.beginPath()
        ctx.moveTo(points[0].x, points[0].y)
        for (let i = 1; i < points.length; i++) {
          const p = points[i]
          ctx.lineTo(p.x, p.y)
        }
        ctx.stroke()
      }
    }, points.length * delay + 20)

    timeouts.push(finalTimeout)

    return () => {
      timeouts.forEach((t) => clearTimeout(t))
    }
  }, [points])

  return (
    <canvas
      id={id}
      ref={ref}
      width={width}
      height={height}
      style={{
        background: '#0b1220',
        border: '1px solid #334155',
        borderRadius: 12,
        width: '100%',
        maxWidth: width,
      }}
    />
  )
}
