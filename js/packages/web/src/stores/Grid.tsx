import { types, Instance, SnapshotIn } from 'mobx-state-tree'
import * as Tone from 'tone'
import { randomBooleanArray } from '../audio/audio-utils'
import { Sampler } from '../audio/insruments/sampler'
// import { Midi } from '@tonejs/midi'
import { parseMidiFromBinary } from '../utils/midiparse'

// export const Note = types.model({
//   name: types.maybe(types.string),
//   time: types.maybe(types.number)
// })

export const Pattern = types
  .model({
    name: types.maybe(types.string),
    index: types.maybe(types.number),
    // notes: types.maybeNull(types.array(Note)),
    steps: types.maybe(types.array(types.boolean)), // visual
    length: 16,
    header: types.maybe(types.string)
  })
  .actions((self) => ({
    async afterCreate() {
      const steps: any = []
      for (let i = 0; i < self.length; i++) {
        const step: any = false
        steps.push(step)
      }
      this.updateHeader(`${self.index}_${self.name}`)
      this.updateSteps(steps)
    },
    updateSteps(steps: any) {
      self.steps = steps
    },
    randomize() {
      this.updateSteps(randomBooleanArray(self.steps!.length))
    },
    resetSteps() {
      const steps: any = []
      for (let i = 0; i < self.steps!.length; i++) {
        steps.push(false)
      }
      this.updateSteps(steps)
    },
    // addNote(name: string, time: number) {
    //   const note = Note.create({name, time})
    //   self.notes!.push(note)
    // },
    modifyStep(stepIndex: number, value: boolean) {
      self.steps![stepIndex] = value
    },
    updateHeader(val: any) {
      self.header = val
    }
  }))

export type IPattern = SnapshotIn<typeof Pattern> | Instance<typeof Pattern>

export const Grid = types
  .model({
    patterns: types.maybe(types.array(Pattern)),
    noteCount: 7,
    clockMode: 'forward',
    currentMultiplier: 1,
    binary: '',
    patternLength: 16,
    isPlaying: false,
    bpm: 91,
    currentPos: 1
  })
  .views((self) => ({
    get multiplierTable() {
      const multiplierTable = [
        1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 0.875, 0.75, 0.66, 0.5, 0.33, 0.25,
        0.125, 0
      ]
      return multiplierTable
    }
  }))
  .actions((self) => {
    const samplers: any = []
    let clock: number = 0
    let loop: Tone.Loop
    // let midiTracks: any = []
    function afterCreate() {
      loop = new Tone.Loop((time) => {
        if (self.clockMode === 'backwards') {
          clock = clock - self.currentMultiplier
        } else {
          clock = clock + self.currentMultiplier
        }
        const internalPos = Math.floor(Math.abs(clock) % 16)
        console.log('[internal pos]: ', internalPos)
        updateCurrentPos(internalPos)
        const patterns = self.patterns!

        if (patterns[0] && patterns[0].steps && patterns[0].steps![internalPos] && samplers[0]) {
          samplers[0].trigger(time, 0, 1.0, 1)
        }

        if (patterns[1] && patterns[1].steps && patterns[1].steps![internalPos] && samplers[1]) {
          samplers[1].trigger(time, 0, 1.0, 1)
        }

        if (patterns[2] && patterns[2].steps && patterns[2].steps![internalPos] && samplers[2]) {
          samplers[2].trigger(time, 0, 1.0, 1)
        }

        if (patterns[3] && patterns[3].steps && patterns[3].steps![internalPos] && samplers[3]) {
          samplers[3].trigger(time, 0, 1.0, 1)
        }

        if (patterns[4] && patterns[4].steps && patterns[4].steps![internalPos] && samplers[4]) {
          samplers[4].trigger(time, 0, 1.0, 1)
        }

        if (patterns[5] && patterns[5].steps && patterns[5].steps![internalPos] && samplers[5]) {
          samplers[5].trigger(time, 0, 1.0, 1)
        }

        if (patterns[6] && patterns[6].steps && patterns[6].steps![internalPos] && samplers[6]) {
          samplers[6].trigger(time, 0, 1.0, 1)
        }

        if (patterns[7] && patterns[7].steps && patterns[7].steps![internalPos] && samplers[7]) {
          samplers[7].trigger(time, 0, 1.0, 1)
        }
      }, '16n').start(0)
      updateBPM(91)
    }
    async function loadSamples() {
      try {
        // sample config (e.g start index)
        // this is so that we can update samples without having to re-deploy the app
        const res = await fetch(
          'https://firebasestorage.googleapis.com/v0/b/grid-2e352.appspot.com/o/spec.json?alt=media'
        )
        const samplerSpecs = await res.json()
        console.log('[samplerSpecs]', samplerSpecs)
        const sampleCount = samplerSpecs.samplePerFolder
        const sampleUrls: any = []
        for (let k = 0; k < sampleCount; k++) {
          const baseUrl = `https://firebasestorage.googleapis.com/v0/b/grid-2e352.appspot.com/o/samples%2F${k}.wav?alt=media&token=a760377f-f2c4-4cd2-9188-61ae9d67e60a`
          sampleUrls.push(baseUrl)
        }
        return sampleUrls
      } catch (e) {
        console.log(e)
      }
    }

    async function createGrid(base64MIDI?: string) {
      console.log(base64MIDI)
      const patterns: any = []
      const reverb = new Tone.Reverb(0.4).toDestination()
      const dac = new Tone.Gain(1.0).toDestination()
      const sampleUrls: any = await loadSamples()
      for (let i = 0; i < 8; i++) {
        const pat = Pattern.create({
          name: `d${i}`,
          index: i,
          length: 16
        })
        console.log('heee')

        patterns.push(pat)
        const sampler = new Sampler()
        sampler.load(sampleUrls[i], () => console.log('loaded'))
        sampler.output.fan(reverb, dac)
        samplers.push(sampler)
      }
      if (base64MIDI) {
        self.binary = base64MIDI
        await binaryToMIDI()
      } else {
        updatePatterns(patterns)
      }
    }

    function resetGrid() {
      for (let i = 0; i < self.patterns!.length; i++) {
        const pat = self.patterns![i]
        pat.resetSteps()
      }
    }

    function randomize() {
      for (let i = 0; i < self.patterns!.length; i++) {
        const pat = self.patterns![i]
        pat.randomize()
      }
    }

    function updateBPM(bpm: number) {
      Tone.Transport.bpm.value = bpm
      self.bpm = bpm
    }
    function updateClockMultipler(cm: number) {
      self.currentMultiplier = self.multiplierTable[cm]
    }

    function updateCurrentPos(pos: any) {
      self.currentPos = pos
    }

    async function start() {
      Tone.start()
      Tone.Transport.start('+0.15')
      loop.start()
      self.isPlaying = true
    }

    async function stop() {
      Tone.Transport.stop()
      loop.stop()
      // loop.dispose()
      self.isPlaying = false
      // self.currentPos = 0
    }

    function updatePatterns(patterns: any) {
      self.patterns = patterns
    }

    function updateStepValue(patternIndex: number, stepIndex: number, value: boolean) {
      // self.patterns![patternIndex].modifyStep(stepIndex, value)
    }

    function updateBinary(b64: string) {
      self.binary = b64
    }

    // function writeToMidi() {
    //   midi.tracks = []

    //   midi.name = 'proj1'
    //   midi.header.name = 'proj1'
    //   midi.header.setTempo(self.bpm)

    //   const track = midi.addTrack()
    //   track.name = 'pat'
    //   track.channel = 0

    //   for (let i = 0; i < self.patterns!.length; i++) {
    //     const pat = self.patterns![i]

    //     for (let j = 0; j < pat.steps!.length; j++) {
    //       const value = pat.steps![j]
    //       const accent = false // todo
    //       if (value === true) {
    //         track.addNote({
    //           midi: 60,
    //           velocity: accent ? 127 : 90,
    //           time: j,
    //           duration: 0.2
    //         })
    //       }
    //     }
    //   }
    //   midiTracks.push(track)

    //   const u8: any = new Uint8Array(midi.toArray())
    //   const b64encoded = btoa(String.fromCharCode.apply(null, u8))
    //   self.binary = b64encoded
    // }
    async function binaryToMIDI() {
      // https://archive.org/details/260DrumMachinePatterns/page/n7/mode/2up
      const midi: any = await parseMidiFromBinary(self.binary)
      const parsedMidi = JSON.parse(midi, undefined)

      const midiNotes = ['C2', 'C#2', 'D2', 'D#2', 'F#2', 'G#2', 'C3', 'C#3']
      const temporaryPatterns: any = []
      // for (let i = 0; i < Math.min(8, parsedMidi.tracks.length); i++) {
      const track = parsedMidi.tracks[0] ? parsedMidi.tracks[0] : null
      if (!track || !track.notes) return
      for (let j = 0; j < track.notes.length; j++) {
        const note = track.notes[j]
        const noteTime = note.time * 8
        const noteName = note.name
        const pattern = {
          name: noteName,
          index: j,
          length: 16,
          header: noteName
        }

        let overridePatternIndex = undefined
        for (let pl = 0; pl < temporaryPatterns.length; pl++) {

          // @ts-ignore
          if (temporaryPatterns[pl].name === pattern.name) {
            // @ts-ignore
            overridePatternIndex = pl
          }
        }

        if (overridePatternIndex !== undefined) {
          // updating an existing pattern/note
          for (let k = 0; k < 16; k++) {
            if (Math.floor(noteTime) === k) {
              // got a match
              // @ts-ignore
              temporaryPatterns[overridePatternIndex].modifyStep(k, true)
            }
          }
        } else {
          const p = Pattern.create(pattern)
          for (let k = 0; k < 16; k++) {
            if (Math.floor(noteTime) === k) p.modifyStep(k, true)
          }
          // @ts-ignore
          temporaryPatterns.push(p)
        }
      }

      const existingNoteNames: any = []
      for (let i = 0; i < temporaryPatterns.length; i++) {
        // @ts-ignore
        const noteName = temporaryPatterns[i].name
        existingNoteNames.push(noteName)
      }
      const missingNotes = midiNotes.filter((e) => !existingNoteNames.includes(e))

      for (let i = 0; i < missingNotes.length; i++) {
        const missingNote = missingNotes[i]
        const pattern = {
          name: missingNote,
          index: existingNoteNames.length + i,
          length: 16,
          header: missingNote
        }
        const p = Pattern.create(pattern)
        temporaryPatterns.push(p)
      }

      const sortedPatterns = temporaryPatterns.sort(function (a: any, b: any) {
        return midiNotes.indexOf(a.name) - midiNotes.indexOf(b.name)
      })
      console.log('[PATTERNS FROM BINARY]: ', sortedPatterns)
      updatePatterns(sortedPatterns)
    }
    return {
      updateClockMultipler,
      afterCreate,
      randomize,
      // writeToMidi,
      binaryToMIDI,
      start,
      stop,
      resetGrid,
      createGrid,
      updateStepValue,
      updateBPM,
      updateBinary,
      updateCurrentPos
    }
  })

export type IGrid = SnapshotIn<typeof Grid> | Instance<typeof Grid>
