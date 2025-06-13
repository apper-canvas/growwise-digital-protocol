import harvestsData from '@/services/mockData/harvests.json'

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

let harvests = [...harvestsData]

const harvestService = {
  async getAll() {
    await delay(300)
    return [...harvests]
  },

  async getById(id) {
    await delay(200)
    const harvest = harvests.find(h => h.id === id)
    if (!harvest) throw new Error('Harvest not found')
    return { ...harvest }
  },

  async getByPlant(plantId) {
    await delay(250)
    return harvests
      .filter(h => h.plantId === plantId)
      .map(h => ({ ...h }))
      .sort((a, b) => new Date(b.harvestDate) - new Date(a.harvestDate))
  },

  async create(harvestData) {
    await delay(400)
    const newHarvest = {
      id: Date.now().toString(),
      harvestDate: new Date().toISOString(),
      ...harvestData
    }
    harvests.push(newHarvest)
    return { ...newHarvest }
  },

  async update(id, updates) {
    await delay(300)
    const index = harvests.findIndex(h => h.id === id)
    if (index === -1) throw new Error('Harvest not found')
    
    harvests[index] = { ...harvests[index], ...updates }
    return { ...harvests[index] }
  },

  async delete(id) {
    await delay(250)
    const index = harvests.findIndex(h => h.id === id)
    if (index === -1) throw new Error('Harvest not found')
    
    harvests.splice(index, 1)
    return true
  },

  async getHarvestStats(plantId) {
    await delay(200)
    const plantHarvests = harvests.filter(h => h.plantId === plantId)
    
    if (plantHarvests.length === 0) {
      return {
        totalHarvests: 0,
        totalYield: 0,
        averageQuality: 0,
        lastHarvest: null
      }
    }

    const totalYield = plantHarvests.reduce((sum, h) => sum + h.yieldAmount, 0)
    const averageQuality = plantHarvests.reduce((sum, h) => sum + h.qualityRating, 0) / plantHarvests.length
    const lastHarvest = plantHarvests.sort((a, b) => new Date(b.harvestDate) - new Date(a.harvestDate))[0]

    return {
      totalHarvests: plantHarvests.length,
      totalYield: Math.round(totalYield * 100) / 100,
      averageQuality: Math.round(averageQuality * 10) / 10,
      lastHarvest: lastHarvest.harvestDate
    }
  }
}

export default harvestService