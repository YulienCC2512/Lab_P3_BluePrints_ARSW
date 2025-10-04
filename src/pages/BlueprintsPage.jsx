import { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  fetchAuthors,
  fetchByAuthor,
  fetchBlueprint,
  deleteBlueprint,
} from '../features/blueprints/blueprintsSlice.js'
import BlueprintCanvas from '../components/BlueprintCanvas.jsx'

export default function BlueprintsPage() {
  const dispatch = useDispatch()
  const { byAuthor, current, status, error } = useSelector((s) => s.blueprints)
  const [authorInput, setAuthorInput] = useState('')
  const [selectedAuthor, setSelectedAuthor] = useState('')
  const items = byAuthor[selectedAuthor] || []

  useEffect(() => {
    dispatch(fetchAuthors())
  }, [dispatch])

  const totalPoints = useMemo(
    () => items.reduce((acc, bp) => acc + (bp.points?.length || 0), 0),
    [items],
  )

  // top-5 con useMemo
  const topBlueprints = useMemo(() => {
    return [...items]
      .sort((a, b) => (b.points?.length || 0) - (a.points?.length || 0))
      .slice(0, 5)
  }, [items])

  const getBlueprints = () => {
    if (!authorInput) return
    setSelectedAuthor(authorInput)
    dispatch(fetchByAuthor(authorInput))
  }

  const openBlueprint = (bp) => {
    dispatch(fetchBlueprint({ author: bp.author, name: bp.name }))
  }

  const handleDelete = (bp) => {
    dispatch(deleteBlueprint({ author: bp.author, name: bp.name }))
  }

  return (
    <div className="container mt-4">
      <div className="row g-4">

        {/* Panel izquierdo */}
        <div className="col-md-6">

          {/* Buscar autor */}
          <div
            className="card mb-3 text-light"
            style={{ backgroundColor: '#0b1220', border: '1px solid #334155' }}
          >
            <div className="card-body">
              <h2 className="card-title" style={{ color: '#93c5fd' }}>
                Blueprints
              </h2>

              <div className="d-flex gap-2">
                <input
                  className="form-control"
                  placeholder="Author"
                  value={authorInput}
                  onChange={(e) => setAuthorInput(e.target.value)}
                  style={{
                    backgroundColor: '#1e293b',
                    color: 'white',
                    border: '1px solid #334155',
                  }}
                />
                <button className="btn btn-primary" onClick={getBlueprints}>
                  Get blueprints
                </button>
              </div>

              {status === 'loading' && <p className="mt-2">Cargando...</p>}
              {status === 'failed' && (
                <p className="mt-2 text-danger">Error: {error}</p>
              )}
            </div>
          </div>

          {/* Lista de blueprints */}
          <div className="card">
            <h3 style={{ marginTop: 0 }}>
              {selectedAuthor ? `${selectedAuthor}'s blueprints:` : 'Results'}
            </h3>
            {status === 'loading' && <p>Cargando...</p>}
            {!items.length && status !== 'loading' && <p>Sin resultados.</p>}
            {!!items.length && (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                  <tr>
                    <th style={{ textAlign: 'left', padding: '8px', borderBottom: '1px solid #334155' }}>Blueprint name</th>
                    <th style={{ textAlign: 'right', padding: '8px', borderBottom: '1px solid #334155' }}>Number of points</th>
                    <th style={{ padding: '8px', borderBottom: '1px solid #334155' }}></th>
                  </tr>
                  </thead>
                  <tbody>
                  {items.map((bp) => (
                    <tr key={bp.name}>
                      <td style={{ padding: '8px', borderBottom: '1px solid #1f2937' }}>{bp.name}</td>
                      <td style={{ padding: '8px', textAlign: 'right', borderBottom: '1px solid #1f2937' }}>
                        {bp.points?.length || 0}
                      </td>
                      <td style={{ padding: '8px', borderBottom: '1px solid #1f2937' }}>
                        <button className="btn btn-sm btn-outline-info me-2" onClick={() => openBlueprint(bp)}>
                          Open
                        </button>
                        <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(bp)}>
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Top-5 */}
          <div
            className="card text-light mt-3"
            style={{ backgroundColor: '#0b1220', border: '1px solid #334155' }}
          >
            <div className="card-body">
              <h3 className="card-title" style={{ color: '#93c5fd' }}>Top 5 Blueprints</h3>
              <ul>
                {topBlueprints.map((bp) => (
                  <li key={bp.name}>
                    {bp.name} ({bp.points?.length || 0} pts)
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Panel derecho */}
        <div className="col-md-6">
          <section className="card">
            <h3 style={{ marginTop: 0 }}>
              Current blueprint: {current?.name || '—'}
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <input
                className="input"
                readOnly
                value={current?.name || ''}
                placeholder="Nombre del blueprint actual"
              />
              <BlueprintCanvas
                id="blueprint-canvas"
                width={520}
                height={360}
                points={current?.points || []}
              />
            </div>
          </section>
        </div>

      </div>
    </div>
  )
}
