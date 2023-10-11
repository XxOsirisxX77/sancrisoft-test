import { useEffect, useState, useRef } from 'react'
import styles from './vehicles-table.module.css'
import { Car } from '../../models/Car.model.tsx'
import { VEHICLES_URL } from '../../constants/server-constants'
import { LOREMFLICKR_URL } from '../../constants/thrid-party-url-constants'
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import ArrowButton, { ButtonDirection } from '../shared/buttons/ArrowButton.tsx'
import CircularButton, { Icon } from '../shared/buttons/CircularButton.tsx'
import VehicleEditModal from './modal/VehicleEditModal.tsx'
import VehicleContext from '../../contexts/VehicleContext.tsx'
import { useToast } from '../../hooks/useToast.tsx'
import TableErrors from './TableErrors.tsx'
import InternalServerError from '../../errors/InternalServerError.tsx'
import VehicleSkeletonTable from './VehicleSkeletonTable.tsx'

const VEHICLES_PER_PAGE = 10

export type ServerVehicleData = {
  vehicles: Car[]
  total: number
}
export type LoremFlickrData = {
  url: string
}

const VehiclesTable = () => {
  const searchParams = new URLSearchParams(document.location.search)
  const pageQuery: number = parseInt(searchParams.get('page') || '1')

  const [vehicles, setVehicles] = useState<Car[]>([])
  const [selectedVehicle, setSelectedVehicle] = useState<Car>()
  const [page, setPage] = useState(isNaN(pageQuery) ? 1 : pageQuery)
  const [showModal, setShowModal] = useState(false)

  const lastPage = useRef(1)
  const isLoading = useRef(true)

  const toast = useToast()

  useEffect(() => {
    isLoading.current = true

    const controller = new AbortController()
    const signal = controller.signal

    fetch(`${VEHICLES_URL}?page=${page}`, {
      mode: 'cors',
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      signal
    })
      .then(async (response) => {
        if (!response.ok) {
          const data = await response.json()
          throw new InternalServerError(data.error)
        }
        return response.json()
      })
      .then((data: ServerVehicleData) => {
        lastPage.current = Math.ceil(data.total / VEHICLES_PER_PAGE)
        if (!data.vehicles.length) {
          setPage(lastPage.current)
          window.history.replaceState(
            null,
            '',
            `${window.location.origin}?page=${lastPage.current}`
          )
          return
        }
        setVehicles(data.vehicles)
        isLoading.current = false
        data.vehicles.forEach((vehicle, index) => {
          fetch(
            `${LOREMFLICKR_URL}/${vehicle.year},${vehicle.make.replace(
              /[ /]/g,
              '_'
            )},${vehicle.model.replace(/[ /]/g, '_')}/all`,
            { signal }
          )
            .then((imageData: LoremFlickrData) => {
              data.vehicles[index].imageUrl = imageData.url
              setVehicles([...data.vehicles])
            })
            .catch((err) => {
              if (err.name !== 'AbortError') {
                toast.sendError?.({ message: err.message })
              }
            })
        })
      })
      .catch((err) => {
        if (err.name !== 'AbortError') {
          toast.sendError?.({ message: err.message })
        }
      })

    return () => controller.abort()
  }, [page])

  const handlePrevious = () => {
    if (page === 1) return
    setPage(page - 1)
    window.history.replaceState(
      null,
      '',
      `${window.location.origin}?page=${page - 1}`
    )
  }

  const handleNext = () => {
    setPage(page + 1)
    window.history.replaceState(
      null,
      '',
      `${window.location.origin}?page=${page + 1}`
    )
  }

  const handleEdit = (vehicle: Car) => {
    setSelectedVehicle(vehicle)
    setShowModal(!showModal)
  }

  const handleDelete = (vehicle: Car) => {
    fetch(`${VEHICLES_URL}/${vehicle.id}`, { method: 'DELETE' })
      .then(async (response) => {
        if (!response.ok) {
          const data = await response.json()
          throw new InternalServerError(data.error)
        }
        return response.json()
      })
      .then((data) => {
        toast.sendSuccess?.({ message: data.message })
        setPage(page)
      })
      .catch((err) => {
        if (err.name !== 'AbortError') {
          toast.sendError?.({ message: err.message })
        }
      })
  }

  const onCloseModal = () => {
    setShowModal(false)
  }

  return (
    <>
      <section
        className={
          showModal ? [styles.section, styles.blur].join(' ') : styles.section
        }
      >
        <table className={styles.table}>
          <thead className={styles.thead}>
            <tr>
              <th></th>
              <th>#</th>
              <th>Year</th>
              <th>Make</th>
              <th>Model</th>
              <th>Location</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {!isLoading.current &&
              vehicles.map((vehicle) => {
                return (
                  <tr key={vehicle.id} className={styles.vehicleDataFormat}>
                    <td>
                      {vehicle.imageUrl && (
                        <img src={vehicle.imageUrl} alt="vehicle image" />
                      )}
                      {!vehicle.imageUrl && (
                        <SkeletonTheme
                          baseColor="#607584"
                          highlightColor="#8ca3b4"
                        >
                          <Skeleton width={26} height={26} />
                        </SkeletonTheme>
                      )}
                    </td>
                    <td>{vehicle.id}</td>
                    <td>{vehicle.year}</td>
                    <td>{vehicle.make}</td>
                    <td>{vehicle.model}</td>
                    <td>{vehicle.location}</td>
                    <td>
                      <CircularButton
                        action={() => handleEdit(vehicle)}
                        icon={Icon.EDIT}
                        title="edit-vehicle"
                      ></CircularButton>
                      <CircularButton
                        action={() => handleDelete(vehicle)}
                        icon={Icon.DELETE}
                        title="delete-vehicle"
                      ></CircularButton>
                    </td>
                  </tr>
                )
              })}
            {isLoading.current && <VehicleSkeletonTable />}
          </tbody>
        </table>
        {!isLoading.current && !vehicles.length && <TableErrors />}
        <div role="group" className={styles.arrowButtonsGroup}>
          <ArrowButton
            buttonDirection={ButtonDirection.LEFT}
            disabled={page === 1}
            action={handlePrevious}
          />
          <ArrowButton
            buttonDirection={ButtonDirection.RIGHT}
            disabled={page === lastPage.current}
            action={handleNext}
          />
        </div>
      </section>

      {selectedVehicle && (
        <VehicleContext.Provider value={{ vehicles, setVehicles }}>
          <VehicleEditModal
            vehicle={selectedVehicle}
            onClose={onCloseModal}
            show={showModal}
          />
        </VehicleContext.Provider>
      )}
    </>
  )
}

export default VehiclesTable
