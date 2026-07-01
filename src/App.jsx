import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { useStore } from './stores/store'
import Home from './pages/Home'
import CustomerDetail from './pages/CustomerDetail'
import Settings from './pages/Settings'

function App() {
  const { initStore } = useStore()
  
  React.useEffect(() => {
    initStore()
  }, [])

  return (
    <Router>
      <div className="bg-neutral-50 min-h-screen">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/customer/:id" element={<CustomerDetail />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App