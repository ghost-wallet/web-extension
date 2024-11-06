import React, { useEffect, useState } from 'react'
import ghostIcon from '../../assets/ghost.svg'

const AnimatedGhostLogo: React.FC = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const centerX = window.innerWidth / 2
      const centerY = window.innerHeight / 2
      setMousePosition({ x: e.clientX - centerX, y: e.clientY - centerY })
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  return (
    <img
      className="w-[7.7rem] h-[7.7rem] transition-transform duration-200 ease-out"
      src={ghostIcon}
      alt="logo"
      style={{
        transform: `translate(${mousePosition.x * 0.05}px, ${mousePosition.y * 0.05}px)`,
      }}
    />
  )
}

export default AnimatedGhostLogo
