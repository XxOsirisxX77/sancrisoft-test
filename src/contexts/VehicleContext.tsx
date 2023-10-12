import { Vehicle } from 'src/models/Car.model'
import { createContext } from 'react'

type VehicleContextProp = {
  vehicles: Vehicle[]
  setVehicles: (vehicle: Vehicle[]) => void
}

const VehicleContext = createContext<VehicleContextProp>({
  vehicles: [],
  setVehicles: () => {}
})

export default VehicleContext
