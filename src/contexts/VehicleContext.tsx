import { Car } from 'models/Car.model'
import { createContext } from 'react'

type VehicleContextProp = {
  vehicles: Car[]
  setVehicles: (vehicle: Car[]) => void
}

const VehicleContext = createContext<VehicleContextProp>({
  vehicles: [],
  setVehicles: () => {}
})

export default VehicleContext
