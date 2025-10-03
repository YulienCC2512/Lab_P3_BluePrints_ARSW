export default function BlueprintList({ items = [], onSelect }) {
  if (!items.length) return <p>No hay blueprints para este autor.</p>

  return (
    <div className="row g-3">
      {items.map((bp) => (
        <div key={bp.name} className="col-md-4">
          <div
            className="card h-100 text-light"
            style={{ backgroundColor: '#0b1220', border: '1px solid #334155' }}
          >
            <div className="card-body">
              <h5 className="card-title" style={{ color: '#93c5fd' }}>
                {bp.name}
              </h5>
              <p className="card-text">
                <strong>Autor:</strong> {bp.author}
              </p>
              <p className="card-text">
                <strong>Puntos:</strong> {bp.points ? bp.points.length : 0}
              </p>
              <button className="btn btn-primary" onClick={() => onSelect(bp)}>
                Ver detalle
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
