import guidesData from '@/services/mockData/guides.json'

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

let guides = [...guidesData]

const guideService = {
  async getAll() {
    await delay(300)
    return [...guides]
  },

  async getById(id) {
    await delay(200)
    const guide = guides.find(g => g.id === id)
    if (!guide) throw new Error('Guide not found')
    return { ...guide }
  },

  async getByCategory(category) {
    await delay(250)
    return guides.filter(g => g.category === category).map(g => ({ ...g }))
  },

  async search(query) {
    await delay(400)
    const lowercaseQuery = query.toLowerCase()
    return guides
      .filter(g => 
        g.title.toLowerCase().includes(lowercaseQuery) ||
        g.description.toLowerCase().includes(lowercaseQuery) ||
        g.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery))
      )
      .map(g => ({ ...g }))
  }
}

export default guideService