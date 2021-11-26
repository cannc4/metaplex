import { createRef, memo, useEffect } from 'react'
//@ts-ignore
import s from './active-grid.module.scss'
import { observer } from 'mobx-react-lite'
import { useTreeState } from '../../stores/Root'
import { Knob } from "react-rotary-knob";
// @ts-ignore
import { useScreenshot, createFileName } from 'use-react-screenshot'
import { useRouter } from 'next/router'

type GridProps = {
  base64MIDI?: string
}
const _ActiveGrid = observer((props: GridProps) => {
  const { activeGrid } = useTreeState()
  const { asPath } = useRouter()


  const { currentPos, isPlaying, currentMultiplier, bpm } = activeGrid
  const ref: any = createRef()
  const [image, takeScreenShot] = useScreenshot()

  const download = (image: any, { name = 'img', extension = 'png' } = {}) => {
    const a = document.createElement('a')
    a.href = image
    a.download = createFileName(extension, name)
    a.click()
  }

  const getImage = () => takeScreenShot(ref.current)
  useEffect(() => {
    if (image) {
      activeGrid.stop()
      const timestamp = Date.now()
      const humanReadableDateTime = new Date(timestamp).toLocaleString()
      download(image, { name: `pattern-${humanReadableDateTime}`, extension: 'png' })
    }
  }, [image])

  useEffect(() => {
    const base64MIDI = asPath && asPath.split('base64MIDI=')[1] ? asPath.split('base64MIDI=')[1] : (props.base64MIDI ? props.base64MIDI : null)
    console.log(base64MIDI)
    if (base64MIDI) activeGrid?.createGrid(base64MIDI)
  }, [activeGrid])

  // TODO: Check is owner of the pattern
  if (!activeGrid?.patterns) return null
  const patterns = activeGrid?.patterns!
  const maxTime = Array.from({ length: 16 }, (_, i) => i + 1)
  return (
    <div className={s.main}>
      <div className={s.menu}>
        {/* <button onClick={getImage}> SAVE SCREENSHOT </button> */}
        {/* <button onClick={async () => activeGrid.writeToMidi()}>{'SAVE MIDI'}</button>
        <button onClick={async () => activeGrid.binaryToMIDI()}>{'BINARY TO MIDI'}</button> */}
        <button
          onClick={async () =>
            isPlaying === true ? await activeGrid.stop() : await activeGrid.start()
          }
        >
          <h3> {isPlaying === false ? 'PLAY' : 'STOP'}</h3>
        </button>
        {/* <button onClick={async () => activeGrid.resetGrid()}>{'reset'}</button>
        <button onClick={async () => activeGrid.randomize()}>{'randomize'}</button> */}
        &nbsp; &nbsp;
        <div>
          <Knob
            value={currentMultiplier}
            style={{ display: "inline-block" }}
            min={1}
            max={20}
            unlockDistance={120}
            preciseMode={false}
            width={200}
            height={200}
            onChange={(value: any) => activeGrid.updateClockMultipler(Math.floor(value))}
          />
          {currentMultiplier}
        </div>
      </div>

      <div className={s.timebar}>
        {maxTime.map((t) => {
          return (
            <p key={`timebar_${t}`} className={s.timepoint}>
              {' '}
              {t}{' '}
            </p>
          )
        })}
      </div>
      <div ref={ref}>
        {activeGrid!.patterns &&
          patterns.map((p, i) => {
            return (
              <div key={`pattern_${i}`} className={s.pattern}>
                {/* <div key={`header_${i}`} className={s.header}>
                {' '}
                <p className={s.headerText}>{p.header} </p>
              </div> */}
                {p.steps!.map((step, j) => {
                  return (
                    <div
                      className={currentPos === j ? s.activeStep : s.step}
                      key={`pattern_${i}_step_${j}`}
                      onClick={() => activeGrid.updateStepValue(p.index!, j, !step)}
                    >
                      <p className={s.value}> {step ? '•' : ''} </p>
                    </div>
                  )
                })}
              </div>
            )
          })}
      </div>
    </div>
  )
})

export const ActiveGrid = memo(_ActiveGrid)
