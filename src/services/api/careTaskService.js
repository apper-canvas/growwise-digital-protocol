import careTasksData from '@/services/mockData/careTasks.json'

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

let careTasks = [...careTasksData]

const careTaskService = {
  async getAll() {
    await delay(300)
    return [...careTasks]
  },

  async getById(id) {
    await delay(200)
    const task = careTasks.find(t => t.id === id)
    if (!task) throw new Error('Care task not found')
    return { ...task }
  },

  async getByPlant(plantId) {
    await delay(250)
    return careTasks.filter(t => t.plantId === plantId).map(t => ({ ...t }))
  },

  async getUpcoming(days = 7) {
    await delay(300)
    const now = new Date()
    const futureDate = new Date(now.getTime() + (days * 24 * 60 * 60 * 1000))
    
    return careTasks
      .filter(t => !t.completed && new Date(t.scheduledDate) <= futureDate)
      .sort((a, b) => new Date(a.scheduledDate) - new Date(b.scheduledDate))
      .map(t => ({ ...t }))
  },

  async create(taskData) {
    await delay(350)
    const newTask = {
      id: Date.now().toString(),
      completed: false,
      notes: '',
      ...taskData
    }
    careTasks.push(newTask)
    return { ...newTask }
  },

  async update(id, updates) {
    await delay(300)
    const index = careTasks.findIndex(t => t.id === id)
    if (index === -1) throw new Error('Care task not found')
    
    careTasks[index] = { ...careTasks[index], ...updates }
    return { ...careTasks[index] }
  },

  async markComplete(id, notes = '') {
    await delay(250)
    const index = careTasks.findIndex(t => t.id === id)
    if (index === -1) throw new Error('Care task not found')
    
    careTasks[index] = { 
      ...careTasks[index], 
      completed: true, 
      completedDate: new Date().toISOString(),
      notes 
    }
    return { ...careTasks[index] }
  },

  async delete(id) {
    await delay(250)
    const index = careTasks.findIndex(t => t.id === id)
    if (index === -1) throw new Error('Care task not found')
    
    careTasks.splice(index, 1)
    return true
  }
}

export default careTaskService