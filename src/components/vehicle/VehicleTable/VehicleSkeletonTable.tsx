import { useRef } from 'react'
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton'
import styles from './vehicles-table.module.css'
import {
  SKELETON_SMALL_IMAGE_SIZE,
  SKELETON_THEME_BASE_COLOR,
  SKELETON_THEME_HIGHLIGHT_COLOR
} from '../../../constants/skeleton-constants'

const VehicleSkeletonTable = () => {
  const skeletonVehicles = useRef(new Array(10).fill(0))

  return (
    <>
      {skeletonVehicles.current.map((_sk, i) => {
        return (
          <SkeletonTheme
            key={i}
            baseColor={SKELETON_THEME_BASE_COLOR}
            highlightColor={SKELETON_THEME_HIGHLIGHT_COLOR}
          >
            <tr className={styles.vehicleDataFormat}>
              <td>
                <Skeleton
                  width={SKELETON_SMALL_IMAGE_SIZE}
                  height={SKELETON_SMALL_IMAGE_SIZE}
                />
              </td>
              <td>
                <Skeleton />
              </td>
              <td>
                <Skeleton />
              </td>
              <td>
                <Skeleton />
              </td>
              <td>
                <Skeleton />
              </td>
              <td>
                <Skeleton />
              </td>
              <td>
                <Skeleton circle={true} />
                <Skeleton circle={true} />
              </td>
            </tr>
          </SkeletonTheme>
        )
      })}
    </>
  )
}

export default VehicleSkeletonTable
