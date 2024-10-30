import React from 'react'
import TableRow from './TableRow'

interface TableSectionProps {
  title?: string
  rows: { label: string; value: React.ReactNode }[]
  className?: string
}

const TableSection: React.FC<TableSectionProps> = ({ title, rows, className }) => {
  return (
    <div className={className}>
      {title && <h1 className="text-lg text-mutedtext mb-2">{title}</h1>}
      <div className="bg-bgdarker rounded-md py-1 px-4">
        <table className="w-full">
          <tbody>
            {rows.map((row, index) => (
              <TableRow key={index} label={row.label} value={row.value} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default TableSection
