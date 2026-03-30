import { Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/layout/Layout'
import Dashboard from './pages/Dashboard'
import Program from './pages/Program'
import TodaySession from './pages/TodaySession'
import Nutrition from './pages/Nutrition'
import Recipes from './pages/Recipes'
import Progress from './pages/Progress'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Dashboard />} />
        <Route path="program" element={<Program />} />
        <Route path="today" element={<TodaySession />} />
        <Route path="nutrition" element={<Nutrition />} />
        <Route path="recipes" element={<Recipes />} />
        <Route path="progress" element={<Progress />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  )
}

export default App
