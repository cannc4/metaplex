import * as Tone from 'tone'
import { Env } from './envelope'

class Sampler {
  players: any[]
  output: any
  envelope: any
  fadeTime: number
  // A Sampler instance is a collection of Tone.Players
  constructor() {
    this.players = []
    this.output = new Tone.Gain(1.0)
    this.envelope = new Env(0.01, 12.0)
    this.envelope.out.connect(this.output)
    this.fadeTime = 0.01
  }

  load(buffer: any, cb: (() => void) | undefined) {
    const player = new Tone.Player(buffer, cb).connect(this.envelope.out)
    this.players.push(player)
  }

  trigger(time: any, idx: number, velocity: any, duration: any) {
    const sample = this.players[idx]
    this.envelope.trigger(time, velocity)
    sample.start(time, 0.0, duration)
  }
}

export { Sampler }
