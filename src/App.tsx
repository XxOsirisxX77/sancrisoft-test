import { Route, Routes } from 'react-router-dom'
import './App.css'
import VehiclesTable from './components/vehicle/VehicleTable/VehiclesTable'
import VehicleDetails from './components/vehicle/VehicleDetails/VehicleDetails'

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
