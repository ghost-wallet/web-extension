import React from 'react'

interface TableRowProps {
  label: string
  value: React.ReactNode
  isFullWidth?: boolean
}

const TableRow: React.FC<TableRowProps> = ({ label, value, isFullWidth }) => {
  return (
    <tr>
      {isFullWidth ? (
        <td colSpan={2} className="text-center text-base py-2">
          {value}
        </td>
      ) : (
        <>
          <td className="text-base text-mutedtext py-2">{label}</td>
          <td className="text-base text-primarytext py-2 text-right">{value}</td>
        </>
      )}
    </tr>
  )
}

export default TableRow
