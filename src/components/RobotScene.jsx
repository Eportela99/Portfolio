import { useState, useEffect, useRef } from 'react'
import RobotTerminal from './RobotTerminal'
import CompanionTerminal from './CompanionTerminal'
import './RobotScene.css'

export default function RobotScene() {
  const [robotVisible,   setRobotVisible]   = useState(true)
  const [companionOpen,  setCompanionOpen]  = useState(false)
  const [talking,        setTalking]        = useState(false)
  const companionRef = useRef(null)

  // Open companion after robot finishes booting
  useEffect(() => {
    const t = setTimeout(() => setCompanionOpen(true), 3500)
    return () => clearTimeout(t)
  }, [])

  const handleCloseRobot = () => {
    setRobotVisible(false)
    setTimeout(() => {
      setRobotVisible(true)
      // Taunt the user
      const lines = [
        '',
        'EN-01: Did you just try',
        'to close me? 😈',
        "You can't get rid of me",
        'that easily.',
      ]
      if (companionRef.current) {
        companionRef.current.appendLines(lines)
      } else {
        setCompanionOpen(true)
        // Companion will open fresh; appendLines after a tick
        setTimeout(() => companionRef.current?.appendLines(lines), 500)
      }
    }, 700)
  }

  return (
    <div className="robot-scene">
      {robotVisible && (
        <RobotTerminal
          talking={talking}
          onClose={handleCloseRobot}
        />
      )}
      {companionOpen && (
        <CompanionTerminal
          ref={companionRef}
          onClose={() => setCompanionOpen(false)}
          onTypingChange={setTalking}
        />
      )}
    </div>
  )
}
