import React from 'react'

interface TableRowProps {
  label: string
  value: React.ReactNode
  isFullWidth?: boolean
  reversedColors?: boolean
}

const TableRow: React.FC<TableRowProps> = ({ label, value, isFullWidth, reversedColors = false }) => {
  return (
    <tr>
      {isFullWidth ? (
        <td colSpan={2} className="text-center text-base py-2">
          {value}
        </td>
      ) : (
        <>
          <td className={`text-base py-2 ${reversedColors ? 'text-primarytext' : 'text-mutedtext'}`}>
            {label}
          </td>
          <td
            className={`text-base py-2 text-right ${reversedColors ? 'text-mutedtext' : 'text-primarytext'}`}
          >
            {value}
          </td>
        </>
      )}
    </tr>
  )
}

export default TableRow
