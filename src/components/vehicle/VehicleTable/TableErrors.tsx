import styles from './vehicles-table.module.css'

const TableErrors = () => {
  return (
    <section className={styles.emptyTable}>
      <p>There are no vehicles.</p>
    </section>
  )
}

export default TableErrors
