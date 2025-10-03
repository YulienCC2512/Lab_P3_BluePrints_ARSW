// src/services/blueprintsService.js
import { apimock } from './apimock.js'
import { blueprintsApiClient } from './blueprintsApiClient.js'

// Vite deja las vars como strings; comparar con 'true'
const useMock = import.meta.env.VITE_USE_MOCK === 'true'

// export named (para que tu slice pueda hacer: import { blueprintsService } ...)
export const blueprintsService = useMock ? apimock : blueprintsApiClient

export default blueprintsService

