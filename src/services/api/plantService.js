import plantsData from '@/services/mockData/plants.json'

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

let plants = [...plantsData]

const plantService = {
  async getAll() {
    await delay(300)
    return [...plants]
  },

  async getById(id) {
    await delay(200)
    const plant = plants.find(p => p.id === id)
    if (!plant) throw new Error('Plant not found')
    return { ...plant }
  },

  async getByGardenBed(gardenBedId) {
    await delay(250)
    return plants.filter(p => p.gardenBedId === gardenBedId).map(p => ({ ...p }))
  },

  async create(plantData) {
    await delay(400)
    const newPlant = {
      id: Date.now().toString(),
      plantedDate: new Date().toISOString(),
      ...plantData
    }
    plants.push(newPlant)
    return { ...newPlant }
  },

  async update(id, updates) {
    await delay(300)
    const index = plants.findIndex(p => p.id === id)
    if (index === -1) throw new Error('Plant not found')
    
    plants[index] = { ...plants[index], ...updates }
    return { ...plants[index] }
  },

  async delete(id) {
    await delay(250)
    const index = plants.findIndex(p => p.id === id)
    if (index === -1) throw new Error('Plant not found')
    
    plants.splice(index, 1)
    return true
  },

async identifyFromPhoto(photoData) {
    await delay(2000) // Simulate AI processing
    // Mock AI identification results
    const mockResults = [
      {
        name: 'Tomato',
        scientificName: 'Solanum lycopersicum',
        type: 'Vegetable',
        confidence: 0.92,
        careRequirements: {
          sunlight: 'Full sun',
          water: 'Regular, deep watering',
          soil: 'Well-draining, rich soil',
          fertilizer: 'Balanced fertilizer every 2 weeks'
        }
      },
      {
        name: 'Rose',
        scientificName: 'Rosa',
        type: 'Flower',
        confidence: 0.87,
        careRequirements: {
          sunlight: 'Full sun to partial shade',
          water: 'Deep watering 2-3 times per week',
          soil: 'Well-draining, slightly acidic soil',
          fertilizer: 'Rose fertilizer monthly'
        }
      }
    ]
    
    return mockResults[Math.floor(Math.random() * mockResults.length)]
  },

  async identifyPestFromPhoto(photoData, plantId = null) {
    await delay(2500) // Simulate AI processing
    
    let plantType = null
    if (plantId) {
      try {
        const plant = await this.getById(plantId)
        plantType = plant.type
      } catch (err) {
        // Continue without plant type context
      }
    }

    // Mock pest identification results
    const mockPests = [
      {
        id: 'aphids',
        name: 'Aphids',
        type: 'pest',
        confidence: 0.89,
        severity: 'moderate',
        symptoms: ['Small green insects on leaves', 'Sticky honeydew', 'Yellowing leaves'],
        treatments: [
          'Spray with insecticidal soap solution',
          'Introduce ladybugs as natural predators',
          'Use neem oil spray every 3-5 days'
        ]
      },
      {
        id: 'powdery_mildew',
        name: 'Powdery Mildew',
        type: 'disease',
        confidence: 0.94,
        severity: 'high',
        symptoms: ['White powdery coating on leaves', 'Yellowing leaves', 'Stunted growth'],
        treatments: [
          'Apply baking soda spray (1 tsp per quart water)',
          'Improve air circulation around plant',
          'Remove affected leaves immediately'
        ]
      }
    ]
    
    const result = mockPests[Math.floor(Math.random() * mockPests.length)]
    
    // Add plant-specific context if available
    if (plantType) {
      result.plantContext = `Detected on ${plantType} plant`
      if (plantType.toLowerCase().includes('edible')) {
        result.treatments = result.treatments.filter(t => 
          t.toLowerCase().includes('organic') || 
          t.toLowerCase().includes('soap') || 
          t.toLowerCase().includes('neem')
        )
        result.treatments.unshift('Use only organic treatments for edible plants')
      }
    }
    
    return result
  }
}

export default plantService