import { Outlet, NavLink, useLocation } from 'react-router-dom'
import { routes } from '@/config/routes'
import ApperIcon from '@/components/ApperIcon'

const Layout = () => {
  const location = useLocation()
  const mainRoutes = Object.values(routes).filter(route => !route.hidden)

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-background">
      {/* Header */}
      <header className="flex-shrink-0 h-16 bg-white border-b border-gray-200 px-4 flex items-center justify-between z-40">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
            <ApperIcon name="Leaf" className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-xl font-display font-semibold text-primary">GrowWise</h1>
        </div>
        
        {/* Desktop Navigation */}
<nav className="hidden md:flex space-x-6">
          {mainRoutes.map((route) => (
            <NavLink
              key={route.id}
              to={route.path}
              className={({ isActive }) =>
                `flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-primary text-white'
                    : 'text-gray-600 hover:text-primary hover:bg-surface'
                }`
              }
            >
              <ApperIcon name={route.icon} className="w-4 h-4" />
              <span className="text-sm font-medium">{route.label}</span>
            </NavLink>
          ))}
        </nav>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden flex-shrink-0 bg-white border-t border-gray-200 px-4 py-2 z-40">
<div className="flex justify-around">
          {mainRoutes.map((route) => (
            <NavLink
              key={route.id}
              to={route.path}
              className={({ isActive }) =>
                `flex flex-col items-center space-y-1 px-3 py-2 rounded-lg transition-colors ${
                  isActive
                    ? 'text-primary'
                    : 'text-gray-500'
                }`
              }
            >
              <ApperIcon name={route.icon} className="w-5 h-5" />
              <span className="text-xs font-medium">{route.label}</span>
            </NavLink>
          ))}
        </div>
      </nav>
    </div>
  )
}

export default Layout