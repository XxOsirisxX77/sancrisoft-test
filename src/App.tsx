import { Route, Routes } from 'react-router-dom'
import './App.css'
import VehiclesTable from './pages/VehicleTable/VehiclesTable'
import VehicleDetails from './pages/VehicleDetails/VehicleDetails'

const App = () => {
  return (
    <main>
      <Routes>
        <Route path="/" element={<VehiclesTable />} />
        <Route path="details" element={<VehicleDetails />} />
      </Routes>
    </main>
  )
}

export default App
