import { useRef } from 'react'
import RobotTerminal from './RobotTerminal'
import './RobotScene.css'

export default function RobotScene() {
  const termRef = useRef(null)

  const handleClose = () => {
    termRef.current?.appendLines(
      ['', 'Did you just try to', 'close me? 😈', "You can't get rid of", 'me that easily.'],
      {
        onStart: () => termRef.current?.setEvil(true),
        onEnd:   () => setTimeout(() => termRef.current?.setEvil(false), 1500),
      }
    )
  }

  return (
    <div className="robot-scene">
      <RobotTerminal ref={termRef} onClose={handleClose} />
    </div>
  )
}
