import Dashboard from '@/components/pages/Dashboard'
import MyGarden from '@/components/pages/MyGarden'
import Calendar from '@/components/pages/Calendar'
import Guides from '@/components/pages/Guides'
import PlantDetail from '@/components/pages/PlantDetail'
import AddPlant from '@/components/pages/AddPlant'
import PestIdentification from '@/components/pages/PestIdentification'
import HarvestLog from '@/components/pages/HarvestLog'

export const routes = {
  dashboard: {
    id: 'dashboard',
    label: 'Dashboard',
    path: '/dashboard',
    icon: 'Home',
    component: Dashboard
  },
  myGarden: {
    id: 'myGarden',
    label: 'My Garden',
    path: '/my-garden',
    icon: 'Leaf',
    component: MyGarden
  },
  calendar: {
    id: 'calendar',
    label: 'Calendar',
    path: '/calendar',
    icon: 'Calendar',
    component: Calendar
  },
  guides: {
    id: 'guides',
    label: 'Guides',
    path: '/guides',
    icon: 'BookOpen',
    component: Guides
  },
  plantDetail: {
    id: 'plantDetail',
    label: 'Plant Detail',
    path: '/plant/:id',
    icon: 'Sprout',
    component: PlantDetail,
    hidden: true
  },
  addPlant: {
    id: 'addPlant',
    label: 'Add Plant',
    path: '/add-plant',
    icon: 'Plus',
component: AddPlant,
    hidden: true
  },
pestIdentification: {
    id: 'pestIdentification',
    label: 'Pest Identification',
    path: '/pest-identification',
    icon: 'Bug',
    component: PestIdentification,
    hidden: true
  },
  harvestLog: {
    id: 'harvestLog',
    label: 'Harvest Log',
    path: '/harvest-log/:id?',
    icon: 'Apple',
    component: HarvestLog,
    hidden: true
  }

export const routeArray = Object.values(routes)