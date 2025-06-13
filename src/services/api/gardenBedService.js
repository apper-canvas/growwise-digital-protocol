import gardenBedsData from '@/services/mockData/gardenBeds.json'

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

let gardenBeds = [...gardenBedsData]

const gardenBedService = {
  async getAll() {
    await delay(250)
    return [...gardenBeds]
  },

  async getById(id) {
    await delay(200)
    const bed = gardenBeds.find(b => b.id === id)
    if (!bed) throw new Error('Garden bed not found')
    return { ...bed }
  },

  async create(bedData) {
    await delay(350)
    const newBed = {
      id: Date.now().toString(),
      ...bedData
    }
    gardenBeds.push(newBed)
    return { ...newBed }
  },

  async update(id, updates) {
    await delay(300)
    const index = gardenBeds.findIndex(b => b.id === id)
    if (index === -1) throw new Error('Garden bed not found')
    
    gardenBeds[index] = { ...gardenBeds[index], ...updates }
    return { ...gardenBeds[index] }
  },

  async delete(id) {
    await delay(250)
    const index = gardenBeds.findIndex(b => b.id === id)
    if (index === -1) throw new Error('Garden bed not found')
    
    gardenBeds.splice(index, 1)
    return true
  }
}

export default gardenBedService