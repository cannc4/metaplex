import * as Tone from 'tone'

class Env {
  attack: any
  release: any
  meter: any
  out: any
  lp: Tone.OnePoleFilter
  line: any
  constructor(attack: any, release: any) {
    this.attack = attack
    this.release = release
    this.meter = new Tone.Meter({ smoothing: 1 })
    this.out = new Tone.Multiply(0.0)
    this.lp = new Tone.OnePoleFilter(50, 'lowpass').fan(this.out.factor, this.meter)
    this.line = new Tone.Signal(0, 'normalRange').connect(this.lp)
  }

  trigger(time: any, velocity: number) {
    this.line.exponentialRampTo(1.0 * velocity, this.attack, time)
    this.line.exponentialRampTo(0.0, this.release, time + this.attack)
  }
}

export { Env }
