import { useContext, useState, useRef } from 'react'
import InputText from 'src/components/inputs/InputText'
import Button from 'src/components/buttons/Button'
import styles from './vehicle-edit-modal.module.css'
import VehicleContext from 'src/contexts/VehicleContext'
import { Vehicle } from 'src/models/Car.model.tsx'
import { VEHICLES_URL } from 'src/constants/server-constants'
import { useToast } from 'src/hooks/useToast'
import InternalServerError from 'src/errors/InternalServerError.tsx'
import NotFoundError from 'src/errors/NotFoundError.tsx'
import InvalidDataError from 'src/errors/InvalidDataError.tsx'

type VehicleEditModalProps = {
  vehicle: Vehicle
  show: boolean
  onClose: () => void
}

const VehicleEditModal = (props: VehicleEditModalProps) => {
  if (!props.show) {
    return null
  }
  const vehicleContext = useContext(VehicleContext)
  const toast = useToast()

  const vehicle = useRef({ ...props.vehicle })
  const [year, setYear] = useState(vehicle.current.year)
  const [make, setMake] = useState(vehicle.current.make)
  const [model, setModel] = useState(vehicle.current.model)
  const [isLoading, setLoading] = useState(false)

  const handleConfirmEdit = () => {
    const vehicleData = vehicleContext.vehicles.find(
      (v) => v.id === vehicle.current.id
    )
    if (vehicleData) {
      setLoading(true)

      vehicle.current.year = year
      vehicle.current.make = make
      vehicle.current.model = model

      fetch(`${VEHICLES_URL}/${vehicle.current.id}`, {
        mode: 'cors',
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(vehicle.current)
      })
        .then(async (response) => {
          if (!response.ok) {
            const data = await response.json()
            if (response.status === 404) {
              throw new NotFoundError(data.error)
            } else if (response.status === 422) {
              throw new InvalidDataError(data.error)
            } else {
              throw new InternalServerError(data.error)
            }
          }
          return response.json()
        })
        .then((data) => {
          vehicleData.year = vehicle.current.year
          vehicleData.make = vehicle.current.make
          vehicleData.model = vehicle.current.model
          vehicleContext.setVehicles(vehicleContext.vehicles)
          toast.sendSuccess?.({
            message: data.message
          })
        })
        .catch((err) => {
          if (err instanceof InternalServerError) {
            toast.sendError?.({
              message: err.message
            })
          } else if (
            err instanceof NotFoundError ||
            err instanceof InvalidDataError
          ) {
            toast.sendWarning?.({
              message: err.message
            })
          }
        })
        .finally(() => setLoading(false))
    }
  }

  const onYearInputValueChange = (value: number) => {
    setYear(value)
  }
  const onMakeInputValueChange = (value: string) => {
    setMake(value)
  }
  const onModelInputValueChange = (value: string) => {
    setModel(value)
  }

  return (
    <div role="dialog" onClick={props.onClose} className={styles.modal}>
      <div onClick={(e) => e.stopPropagation()} className={styles.modalContent}>
        <form
          onSubmit={(e) => {
            e.preventDefault()
            handleConfirmEdit()
          }}
          autoComplete="off"
        >
          <div
            aria-labelledby="modal-title"
            role="heading"
            className={styles.modalHeader}
          >
            <h2 id="modal-title" className={styles.modalTitle}>
              Vehicle Edit
            </h2>
          </div>
          <div role="group" className={styles.modalBody}>
            <InputText
              onChange={(e) => onYearInputValueChange(parseInt(e.target.value))}
              type="number"
              value={year}
              fieldName="year"
              focus={true}
            />
            <InputText
              onChange={(e) => onMakeInputValueChange(e.target.value)}
              type="text"
              value={make}
              fieldName="make"
            />
            <InputText
              onChange={(e) => onModelInputValueChange(e.target.value)}
              type="text"
              value={model}
              fieldName="model"
            />
          </div>
          <div role="group" className={styles.modalFooter}>
            <Button
              text="Cancel"
              type="button"
              isLoading={isLoading}
              disabled={isLoading}
              action={props.onClose}
            />
            <Button
              text="Confirm"
              isLoading={isLoading}
              disabled={isLoading}
              isPrimary={true}
              hasProgressIcon={true}
            />
          </div>
        </form>
      </div>
    </div>
  )
}

export default VehicleEditModal
