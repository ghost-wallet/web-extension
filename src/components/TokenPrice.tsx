import React from 'react'

interface FormattedTokenPriceProps {
  value: string
}

const TokenPrice: React.FC<FormattedTokenPriceProps> = ({ value }) => {
  const renderFormattedValue = () => {
    const regex = /\((\d+)\)/g
    const parts = value.split(regex)

    return parts.map((part, index) => {
      if (index % 2 !== 0) {
        return <sub key={index}>{part}</sub>
      }
      return <span key={index}>{part}</span>
    })
  }

  return <span>{renderFormattedValue()}</span>
}

export default TokenPrice
