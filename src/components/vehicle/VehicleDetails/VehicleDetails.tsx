import { useEffect, useState } from 'react'
import { Car } from '../../../models/Car.model'
import { Navigate, useLocation } from 'react-router-dom'
import { LOREMFLICKR_BIG_IMAGE_URL } from '../../../constants/thrid-party-url-constants'
import { LoremFlickrData } from '../VehicleTable/VehiclesTable'
import { useToast } from '../../../hooks/useToast'
import styles from './vehicle-details.module.css'
import ArrowButton, {
  ButtonDirection
} from '../../../components/shared/buttons/ArrowButton'
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton'
import {
  SKELETON_BIG_IMAGE_SIZE,
  SKELETON_THEME_BASE_COLOR,
  SKELETON_THEME_HIGHLIGHT_COLOR
} from '../../../constants/skeleton-constants'

const VehicleDetails = () => {
  const location = useLocation()
  const toast = useToast()

  const [vehicle, setVehicle] = useState<Car>(location.state?.vehicle)
  const [isLoading, setLoading] = useState(true)

  if (!vehicle) {
    return <Navigate to="/" replace={true} />
  }

  useEffect(() => {
    const controller = new AbortController()
    const signal = controller.signal

    fetch(
      `${LOREMFLICKR_BIG_IMAGE_URL}/${vehicle.year},${vehicle.make.replace(
        /[ /]/g,
        '_'
      )},${vehicle.model.replace(/[ /]/g, '_')}/all`,
      { signal }
    )
      .then((imageData: LoremFlickrData) => {
        vehicle.imageUrl = imageData.url
        setVehicle({ ...vehicle })
        setLoading(false)
      })
      .catch((err) => {
        if (err.name !== 'AbortError') {
          toast.sendError?.({ message: err.message })
        }
      })
  }, [])

  const handleBack = () => {
    window.history.back()
  }

  return (
    <>
      <section aria-label="vehicle details" className={styles.section}>
        <nav className={styles.backButtonContainer}>
          <ArrowButton
            buttonDirection={ButtonDirection.LEFT}
            action={handleBack}
          />
        </nav>
        <div role="group" className={styles.imageContainer}>
          {isLoading && (
            <SkeletonTheme
              baseColor={SKELETON_THEME_BASE_COLOR}
              highlightColor={SKELETON_THEME_HIGHLIGHT_COLOR}
            >
              <Skeleton
                circle={true}
                width={SKELETON_BIG_IMAGE_SIZE}
                height={SKELETON_BIG_IMAGE_SIZE}
              />
            </SkeletonTheme>
          )}
          {!isLoading && <img src={vehicle.imageUrl} alt="vehicle image" />}
        </div>
        <div role="group" className={styles.detailsContainer}>
          <h3>
            {vehicle.make.toUpperCase()} {vehicle.model.toUpperCase()}
          </h3>
          <h4>{vehicle.year}</h4>
          <h5>{vehicle.location}</h5>
        </div>
      </section>
    </>
  )
}

export default VehicleDetails
