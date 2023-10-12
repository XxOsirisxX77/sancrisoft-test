import { useEffect, useState, useRef } from 'react'
import styles from './vehicles-table.module.css'
import { Vehicle } from 'src/models/Car.model.tsx'
import { VEHICLES_URL } from 'src/constants/server-constants.tsx'
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import ArrowButton, {
  ButtonDirection
} from 'src/components/buttons/ArrowButton.tsx'
import CircularButton, {
  CTAIcon
} from 'src/components/buttons/CircularButton.tsx'
import VehicleEditModal from './modal/VehicleEditModal.tsx'
import VehicleContext from 'src/contexts/VehicleContext.tsx'
import { useToast } from 'src/hooks/useToast.tsx'
import TableErrors from './TableErrors.tsx'
import InternalServerError from 'src/errors/InternalServerError.tsx'
import VehicleSkeletonTable from './VehicleSkeletonTable.tsx'
import { useNavigate } from 'react-router-dom'
import {
  SKELETON_SMALL_IMAGE_SIZE,
  SKELETON_THEME_BASE_COLOR,
  SKELETON_THEME_HIGHLIGHT_COLOR
} from '../../constants/skeleton-constants.tsx'
import { LOREMFLICKR_URL } from 'src/constants/thrid-party-url-constants.tsx'

const VEHICLES_PER_PAGE = 10

export type ServerVehicleData = {
  vehicles: Vehicle[]
  total: number
}

export type LoremFlickrData = {
  url: string
}

const VehiclesTable = () => {
  const searchParams = new URLSearchParams(document.location.search)
  const pageQuery: number = parseInt(searchParams.get('page') || '1')

  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle>()
  const [reload, setReload] = useState({})
  const [page, setPage] = useState(isNaN(pageQuery) ? 1 : pageQuery)
  const [showModal, setShowModal] = useState(false)

  const lastPage = useRef(1)
  const isLoading = useRef(true)
  const navigate = useNavigate()

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
  }, [page, reload])

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

  const handleEdit = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle)
    setShowModal(!showModal)
  }

  const handleDelete = (vehicle: Vehicle) => {
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
        setReload({})
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

  const handleDetailsPage = (vehicle: Vehicle) => {
    navigate('/details', { state: { vehicle } })
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
                        <img
                          className={styles.vehicleImage}
                          src={vehicle.imageUrl}
                          alt="vehicle image"
                          onClick={() => handleDetailsPage(vehicle)}
                        />
                      )}
                      {!vehicle.imageUrl && (
                        <SkeletonTheme
                          baseColor={SKELETON_THEME_BASE_COLOR}
                          highlightColor={SKELETON_THEME_HIGHLIGHT_COLOR}
                        >
                          <Skeleton
                            width={SKELETON_SMALL_IMAGE_SIZE}
                            height={SKELETON_SMALL_IMAGE_SIZE}
                          />
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
                        icon={CTAIcon.EDIT}
                        title="edit-vehicle"
                      ></CircularButton>
                      <CircularButton
                        action={() => handleDelete(vehicle)}
                        icon={CTAIcon.DELETE}
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
