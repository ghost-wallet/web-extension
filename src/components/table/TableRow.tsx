import React from 'react'

interface TableRowProps {
  label: string
  value: string | number
}

const TableRow: React.FC<TableRowProps> = ({ label, value }) => {
  return (
    <tr>
      <td className="text-base font-lato text-mutedtext py-2">{label}</td>
      <td className="text-base font-lato text-primarytext py-2 text-right">{value}</td>
    </tr>
  )
}

export default TableRow
