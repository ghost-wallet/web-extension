import React from 'react'

const LoadingPlaceholder: React.FC<{ className: string }> = ({ className }) => (
  <div className={`bg-muted animate-pulse ${className}`} />
)

export default LoadingPlaceholder