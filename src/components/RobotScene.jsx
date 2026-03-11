import { useState, useEffect, useRef } from 'react'
import RobotTerminal from './RobotTerminal'
import CompanionTerminal from './CompanionTerminal'
import './RobotScene.css'

export default function RobotScene() {
  const [robotVisible,  setRobotVisible]  = useState(true)
  const [companionOpen, setCompanionOpen] = useState(false)
  const [talking,       setTalking]       = useState(false)
  const [evil,          setEvil]          = useState(false)
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

      const sendTaunt = () => {
        companionRef.current?.appendLines(
          [
            '',
            'Did you just try to',
            "close me? 😈",
            "You can't get rid of",
            'me that easily.',
          ],
          {
            onStart: () => setEvil(true),
            onEnd:   () => {
              // Let the evil face linger a moment before going back to normal
              setTimeout(() => setEvil(false), 1500)
            },
          }
        )
      }

      if (companionRef.current) {
        sendTaunt()
      } else {
        setCompanionOpen(true)
        setTimeout(sendTaunt, 500)
      }
    }, 700)
  }

  return (
    <div className="robot-scene">
      {robotVisible && (
        <RobotTerminal
          talking={talking}
          evil={evil}
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
