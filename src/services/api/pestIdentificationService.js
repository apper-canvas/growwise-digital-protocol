const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

// Mock pest/disease database
const pestDatabase = [
  {
    id: 'aphids',
    name: 'Aphids',
    type: 'pest',
    commonOn: ['tomato', 'rose', 'lettuce', 'pepper'],
    symptoms: ['Small green or black insects on leaves', 'Sticky honeydew on leaves', 'Yellowing leaves'],
    treatments: [
      'Spray with insecticidal soap solution',
      'Introduce ladybugs as natural predators',
      'Use neem oil spray every 3-5 days',
      'Remove heavily infested leaves'
    ],
    severity: 'moderate',
    prevention: 'Regular inspection, proper spacing for air circulation'
  },
  {
    id: 'powdery_mildew',
    name: 'Powdery Mildew',
    type: 'disease',
    commonOn: ['rose', 'tomato', 'cucumber', 'pumpkin'],
    symptoms: ['White powdery coating on leaves', 'Yellowing and curling leaves', 'Stunted growth'],
    treatments: [
      'Apply baking soda spray (1 tsp per quart water)',
      'Improve air circulation around plant',
      'Remove affected leaves immediately',
      'Use sulfur-based fungicide if severe'
    ],
    severity: 'high',
    prevention: 'Avoid overhead watering, ensure good air circulation'
  },
  {
    id: 'spider_mites',
    name: 'Spider Mites',
    type: 'pest',
    commonOn: ['tomato', 'pepper', 'bean', 'rose'],
    symptoms: ['Fine webbing on leaves', 'Tiny yellow or red spots on leaves', 'Leaves turning bronze or yellow'],
    treatments: [
      'Increase humidity around plant',
      'Spray with water to dislodge mites',
      'Apply predatory mites',
      'Use miticide if infestation is severe'
    ],
    severity: 'high',
    prevention: 'Maintain adequate humidity, regular plant inspection'
  },
  {
    id: 'leaf_spot',
    name: 'Leaf Spot Disease',
    type: 'disease',
    commonOn: ['tomato', 'pepper', 'lettuce', 'spinach'],
    symptoms: ['Dark spots with yellow halos on leaves', 'Leaves dropping prematurely', 'Spots may have concentric rings'],
    treatments: [
      'Remove and destroy affected leaves',
      'Apply copper-based fungicide',
      'Improve air circulation',
      'Avoid overhead watering'
    ],
    severity: 'moderate',
    prevention: 'Water at soil level, provide good air circulation'
  },
  {
    id: 'whitefly',
    name: 'Whitefly',
    type: 'pest',
    commonOn: ['tomato', 'pepper', 'cucumber', 'cabbage'],
    symptoms: ['Small white flying insects', 'Yellowing leaves', 'Sticky honeydew on leaves'],
    treatments: [
      'Use yellow sticky traps',
      'Apply insecticidal soap',
      'Introduce beneficial insects',
      'Vacuum adults in early morning'
    ],
    severity: 'moderate',
    prevention: 'Regular monitoring, remove weeds that harbor whiteflies'
  }
]

const pestIdentificationService = {
  async identifyPestFromPhoto(photoData, plantType = null) {
    await delay(2500) // Simulate AI processing time
    
    // Simulate AI analysis with realistic results
    const possiblePests = pestDatabase.filter(pest => 
      !plantType || pest.commonOn.some(plant => 
        plant.toLowerCase().includes(plantType.toLowerCase()) ||
        plantType.toLowerCase().includes(plant.toLowerCase())
      )
    )
    
    // Select random pest with confidence score
    const identifiedPest = possiblePests.length > 0 
      ? possiblePests[Math.floor(Math.random() * possiblePests.length)]
      : pestDatabase[Math.floor(Math.random() * pestDatabase.length)]
    
    const confidence = Math.random() * 0.3 + 0.7 // 70-100% confidence
    
    return {
      id: identifiedPest.id,
      name: identifiedPest.name,
      type: identifiedPest.type,
      confidence: Math.round(confidence * 100) / 100,
      symptoms: identifiedPest.symptoms,
      treatments: identifiedPest.treatments,
      severity: identifiedPest.severity,
      prevention: identifiedPest.prevention,
      matchedSymptoms: identifiedPest.symptoms.slice(0, 2) // Show first 2 symptoms as "detected"
    }
  },

  async getTreatmentSuggestions(pestId, plantType = null) {
    await delay(300)
    
    const pest = pestDatabase.find(p => p.id === pestId)
    if (!pest) throw new Error('Pest information not found')
    
    // Customize treatments based on plant type
    let treatments = [...pest.treatments]
    
    if (plantType?.toLowerCase().includes('edible') || 
        ['tomato', 'lettuce', 'pepper', 'cucumber'].some(p => 
          plantType?.toLowerCase().includes(p))) {
      treatments = treatments.filter(t => 
        !t.toLowerCase().includes('fungicide') || 
        t.toLowerCase().includes('organic') ||
        t.toLowerCase().includes('soap') ||
        t.toLowerCase().includes('neem')
      )
      treatments.unshift('Use only organic treatments for edible plants')
    }
    
    return {
      ...pest,
      customTreatments: treatments,
      urgency: pest.severity === 'high' ? 'immediate' : 
               pest.severity === 'moderate' ? '3-5 days' : '1-2 weeks'
    }
  },

  async getAllPests() {
    await delay(200)
    return [...pestDatabase]
  },

  async getPestsByType(type) {
    await delay(200)
    return pestDatabase.filter(pest => pest.type === type)
  }
}

export default pestIdentificationService