import React from 'react'

interface TableRowProps {
  label: string
  value: React.ReactNode
}

const TableRow: React.FC<TableRowProps> = ({ label, value }) => {
  return (
    <tr>
      <td className="text-base text-mutedtext py-2">{label}</td>
      <td className="text-base text-primarytext py-2 text-right">{value}</td>
    </tr>
  )
}

export default TableRow
