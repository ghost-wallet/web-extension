import React from 'react'

const Spinner: React.FC = () => (
  <div className="flex justify-center items-center">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-primary"></div>
  </div>
)

export default Spinner
