import React, { ReactNode } from 'react'

interface BottomFixedContainerProps {
  children: ReactNode
  className?: string
}

const BottomFixedContainer: React.FC<BottomFixedContainerProps> = ({ children, className = '' }) => {
  return (
    <div
      className={`fixed bottom-0 left-0 w-full bg-bgdark border-t border-darkmuted ${className}`}
      style={{ boxShadow: '0 -10px 15px rgba(0, 0, 0, 0.3)' }}
    >
      {children}
    </div>
  )
}

export default BottomFixedContainer
