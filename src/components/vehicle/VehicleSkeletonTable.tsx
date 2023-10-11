import { useRef } from 'react'
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton'
import styles from './vehicles-table.module.css'

const VehicleSkeletonTable = () => {
  const skeletonVehicles = useRef(new Array(10).fill(0))

  return (
    <>
      {skeletonVehicles.current.map((_sk, i) => {
        return (
          <SkeletonTheme key={i} baseColor="#607584" highlightColor="#8ca3b4">
            <tr className={styles.vehicleDataFormat}>
              <td>
                <Skeleton width={26} height={26} />
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
            </tr>
          </SkeletonTheme>
        )
      })}
    </>
  )
}

export default VehicleSkeletonTable
