import React from 'react'
import { useNavigate } from 'react-router-dom'
import Title from '@/components/Header'
import CloseButton from '@/components/buttons/CloseButton'
import AnimatedCheckmark from '@/components/animations/AnimatedCheckmark'

interface ConfirmationPageProps {
  title: string
  children: React.ReactNode
}

const ConfirmationPage: React.FC<ConfirmationPageProps> = ({ title, children }) => {
  const navigate = useNavigate()

  return (
    <div className="flex flex-col min-h-screen bg-dark p-4">
      <div className="flex flex-col items-center">
        <Title title={title} />
        <AnimatedCheckmark />
      </div>

      <div className="flex-1 flex flex-col items-center justify-center">{children}</div>

      <div className="mt-auto">
        <CloseButton onClick={() => navigate('/wallet')} />
      </div>
    </div>
  )
}

export default ConfirmationPage
