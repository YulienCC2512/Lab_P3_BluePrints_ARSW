

import { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchAuthors, fetchByAuthor, fetchBlueprint } from '../features/blueprints/blueprintsSlice.js'
import { selectTopBlueprints } from '../features/blueprints/blueprintsSelectors.js'
import BlueprintCanvas from '../components/BlueprintCanvas.jsx'
import { deleteBlueprint } from '../features/blueprints/blueprintsSlice.js'

export default function BlueprintsPage() {
  const dispatch = useDispatch()
  const { byAuthor, current, status, error } = useSelector((s) => s.blueprints)
  const topBlueprints = useSelector(selectTopBlueprints)

  const [authorInput, setAuthorInput] = useState('')
  const [selectedAuthor, setSelectedAuthor] = useState('')
  const items = byAuthor[selectedAuthor] || []

  useEffect(() => {
    dispatch(fetchAuthors())
  }, [dispatch])

  const totalPoints = useMemo(
    () => items.reduce((acc, bp) => acc + (bp.points?.length || 0), 0),
    [items]
  )

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
                  style={{ backgroundColor: '#1e293b', color: 'white', border: '1px solid #334155' }}
                />
                <button className="btn btn-primary" onClick={getBlueprints}>
                  Get blueprints
                </button>
              </div>

              {status === 'loading' && <p className="mt-2">Cargando...</p>}
              {status === 'failed' && <p className="mt-2 text-danger">Error: {error}</p>}
            </div>
          </div>

          <div
            className="card text-light"
            style={{ backgroundColor: '#0b1220', border: '1px solid #334155' }}
          >
            <div className="card-body">
              <h3 className="card-title" style={{ color: '#93c5fd' }}>
                {selectedAuthor ? `${selectedAuthor}'s blueprints:` : 'Results'}
              </h3>

              {status === 'loading' && <p>Cargando...</p>}
              {!items.length && status !== 'loading' && <p>Sin resultados.</p>}

              {!!items.length && (
                <div className="table-responsive">
                  <table className="table table-sm table-borderless align-middle text-light">
                    <thead style={{ borderBottom: '1px solid #334155' }}>
                    <tr style={{ color: '#93c5fd' }}>
                      <th>Blueprint name</th>
                      <th className="text-end">Number of points</th>
                      <th></th>
                    </tr>
                    </thead>
                    <tbody>
                    {items.map((bp) => (
                      <tr key={bp.name} style={{ borderBottom: '1px solid #1f2937' }}>
                        <td>{bp.name}</td>
                        <td className="text-end">{bp.points?.length || 0}</td>
                        <td>
                          <button
                            className="btn btn-outline-primary btn-sm"
                            onClick={() => openBlueprint(bp)}
                          >
                            Open
                          </button>
                          <td>
                            <button className="btn btn-outline-danger btn-sm" onClick={() => handleDelete(bp)}>
                              Delete
                            </button>
                          </td>
                        </td>
                      </tr>
                    ))}
                    </tbody>
                  </table>
                </div>
              )}

              <p className="fw-bold mt-3">Total user points: {totalPoints}</p>
            </div>
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


        <div className="col-md-6">
          <div
            className="card text-light"
            style={{ backgroundColor: '#0b1220', border: '1px solid #334155' }}
          >
            <div className="card-body">
              <h3 className="card-title" style={{ color: '#93c5fd' }}>
                Current blueprint: {current?.name || '—'}
              </h3>
              <BlueprintCanvas
                id="blueprint-canvas"
                width={520}
                height={360}
                points={current?.points || []}
              />

              {status === 'loading' && <p>Cargando...</p>}
              {status === 'failed' && <p className="text-danger">Error: {error}</p>}
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
