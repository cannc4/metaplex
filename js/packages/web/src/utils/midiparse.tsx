import * as MidiConvert from 'midiconvert'

export const dataURItoBlob = (data: any) => {
  const b64 = `data:audio/midi;base64,${data}`
  const byteString = atob(b64.split(',')[1])
  const mimeString = b64.split(',')[0].split(':')[1].split(';')[0]

  let ab = new ArrayBuffer(byteString.length)
  let ia = new Uint8Array(ab)
  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i)
  }

  return new Blob([ab], { type: mimeString })
}

export const parseMidiFromBinary = async (data: any) => {
  const reader = new FileReader()
  return new Promise<any>((resolve, reject) => {
    reader.onload = (e) => {
      const partsData = MidiConvert.parse(e.target!.result!)
      console.log(JSON.stringify(partsData, undefined, 2))
      resolve(JSON.stringify(partsData, undefined, 2))
    }
    reader.readAsArrayBuffer(dataURItoBlob(data))
  })
}
