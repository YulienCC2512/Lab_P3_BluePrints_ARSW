import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import api from '../../services/apiClient.js'
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { blueprintsService } from '../../services/blueprintsService.js'

export const fetchAuthors = createAsyncThunk('blueprints/fetchAuthors', async () => {
  const { data } = await api.get('/blueprints')
  // Se espera que la API devuelva un array de objetos { author, name, points }
  const authors = [...new Set(data.map((bp) => bp.author))]
  return authors
})

export const fetchByAuthor = createAsyncThunk('blueprints/fetchByAuthor', async (author) => {
  try {
    const { data } = await api.get(`/blueprints/${encodeURIComponent(author)}`)
    return { author, items: data }
  } catch (err) {
    // Fallback mock data cuando no hay backend disponible
    const mock = [
      { author, name: 'demo-plan-1', points: [{ x: 10, y: 10 }, { x: 40, y: 60 }] },
      { author, name: 'demo-plan-2', points: [{ x: 20, y: 30 }] },
    ]
    return { author, items: mock }
  }
})

export const fetchBlueprint = createAsyncThunk(
  'blueprints/fetchBlueprint',
  async ({ author, name }) => {
    const { data } = await api.get(
      `/blueprints/${encodeURIComponent(author)}/${encodeURIComponent(name)}`,
    )
    return data
  },
)

export const createBlueprint = createAsyncThunk('blueprints/createBlueprint', async (payload) => {
  const { data } = await api.post('/blueprints', payload)
  return data
})

export const updateBlueprint = createAsyncThunk(
  'blueprints/updateBlueprint',
  async ({ author, name, payload }, { rejectWithValue }) => {
    try {
      const updated = await blueprintsService.update(author, name, payload)
      return updated
    } catch (err) {
      return rejectWithValue(err.message || 'Update failed')
    }
  })

export const deleteBlueprint = createAsyncThunk(
  'blueprints/deleteBlueprint',
  async ({ author, name }, { rejectWithValue }) => {
    try {
      await blueprintsService.remove(author, name)
      return { author, name }
    } catch (err) {
      return rejectWithValue(err.message || 'Delete failed')
    }
  }
)



const slice = createSlice({
  name: 'blueprints',
  initialState: {
    authors: [],
    byAuthor: {},
    current: null,
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAuthors.pending, (s) => {
        s.status = 'loading'
      })
      .addCase(fetchAuthors.fulfilled, (s, a) => {
        s.status = 'succeeded'
        s.authors = a.payload
      })
      .addCase(fetchAuthors.rejected, (s, a) => {
        s.status = 'failed'
        s.error = a.error.message
      })
      .addCase(fetchByAuthor.fulfilled, (s, a) => {
        s.byAuthor[a.payload.author] = a.payload.items
      })
      .addCase(fetchBlueprint.fulfilled, (s, a) => {
        s.current = a.payload
      })
      .addCase(createBlueprint.fulfilled, (s, a) => {
        const bp = a.payload
        if (s.byAuthor[bp.author]) s.byAuthor[bp.author].push(bp)
      })
      // updateBlueprint
      .addCase(updateBlueprint.pending, (s) => { s.status = 'loading' })
      .addCase(updateBlueprint.fulfilled, (s, a) => {
        s.status = 'succeeded'
        const bp = a.payload

        if (s.byAuthor[bp.author]) {
          const idx = s.byAuthor[bp.author].findIndex(x => x.name === bp.name)
          if (idx !== -1) s.byAuthor[bp.author][idx] = bp
        }

        if (s.current && s.current.author === bp.author && s.current.name === bp.name) {
          s.current = bp
        }
      })
      .addCase(updateBlueprint.rejected, (s, a) => {
        s.status = 'failed'
        s.error = a.payload || a.error.message
      })

      .addCase(deleteBlueprint.pending, (s, a) => {
        s.status = 'loading'
        const { author, name } = a.meta.arg
        const list = s.byAuthor[author] || []
        const idx = list.findIndex(bp => bp.name === name)
        if (idx !== -1) {
          const key = `${author}|${name}`
          s.deletes[key] = list[idx] // guardar backup
          list.splice(idx, 1) // remover optimísticamente
        }
      })
      .addCase(deleteBlueprint.fulfilled, (s, a) => {
        const { author, name } = a.meta.arg
        if (s.byAuthor[author]) {
          s.byAuthor[author] = s.byAuthor[author].filter((bp) => bp.name !== name)
        }
        if (s.current && s.current.name === name && s.current.author === author) {
          s.current = null
        }
      })

      .addCase(deleteBlueprint.rejected, (s, a) => {
        s.status = 'failed'
        s.error = a.payload || a.error.message
        const { author, name } = a.meta.arg
        const key = `${author}|${name}`
        const backup = s.deletes[key]
        if (backup) {
          if (!s.byAuthor[author]) s.byAuthor[author] = []
          s.byAuthor[author].push(backup)
          delete s.deletes[key]
        }
      })
  },
})

export default slice.reducer
