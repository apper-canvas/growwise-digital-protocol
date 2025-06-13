// Mock data for user profile
const mockProfile = {
  id: 1,
  name: 'Garden Enthusiast',
  email: 'gardener@example.com',
  phone: '+1 (555) 123-4567',
  location: 'San Francisco, CA',
  experience: 'intermediate',
  bio: 'Passionate about sustainable gardening and growing my own vegetables. I love experimenting with new plant varieties and sharing knowledge with fellow gardeners.',
  avatar: null,
  createdAt: '2024-01-15T10:30:00Z',
  preferences: {
    notifications: true,
    weatherAlerts: true,
    taskReminders: true
  }
}

// Simulate API delays
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

export const profileService = {
  async getProfile() {
    await delay(300)
    return { ...mockProfile }
  },

  async updateProfile(profileData) {
    await delay(500)
    // In a real app, this would send data to the server
    Object.assign(mockProfile, profileData)
    return { ...mockProfile }
  },

  async uploadAvatar(file) {
    await delay(800)
    // In a real app, this would upload to cloud storage
    const mockUrl = `https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face`
    mockProfile.avatar = mockUrl
    return mockUrl
  },

  async updatePreferences(preferences) {
    await delay(300)
    mockProfile.preferences = { ...mockProfile.preferences, ...preferences }
    return { ...mockProfile.preferences }
  },

  async deleteAccount() {
    await delay(1000)
    // In a real app, this would handle account deletion
    return { success: true }
  }
}