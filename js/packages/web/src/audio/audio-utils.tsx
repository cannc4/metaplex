export const createRoomID = (prefix: any, code: any) => `${prefix}.${code}`

export const freqMap = (midi: number) => {
  return Math.pow(2, midi / 12.0)
}

export const clip = (i: number, low: number, high: number) => {
  return Math.min(Math.max(i, low), high)
}

const fmod = (a: number, b: number) => {
  return Number((a - Math.floor(a / b) * b).toPrecision(8))
}

export const mapRange = (i: number, iMin: number, iMax: number, oMin: number, oMax: number) => {
  return ((i - iMin) * (oMax - oMin)) / (iMax - iMin) + oMin
}

export const wrap = (i: number, min: number, max: number) => {
  let retVal
  let range = max - min

  if (i < max && i >= min) {
    return i
  }

  if (max == min) {
    return min
  }

  if (i < min) {
    retVal = i
    while (retVal < min) retVal += range
  } else retVal = fmod(i - min, range) + min

  return retVal
}

export const rotate = (arr: any[], count: number) => {
  count -= arr.length * Math.floor(count / arr.length)
  arr.push.apply(arr, arr.splice(0, count))
  return arr
}

export const randomBooleanArray = (length: number) => {
  const arr: any = []
  for (var i = 0; i < length; i++) {
    arr[i] = Math.random() > 0.75
  }
  return arr
}

export const deepCopy = (arr: any) => {
  return JSON.parse(JSON.stringify(arr))
}

export const shiftColumnDown = (grid: string | any[], col: string | number) => {
  let temp = deepCopy(grid) // deep copy
  for (var i = 0; i < grid.length; i++) {
    // in each row
    let below = (i + 1) % grid.length
    grid[below][col] = temp[i][col]
  }
}

export const shiftColumnUp = (grid: string | any[], col: string | number) => {
  let temp = deepCopy(grid) // deep copy
  for (var i = 0; i < grid.length; i++) {
    // in each row
    let invert = grid.length - i - 1
    let above = invert - 1

    if (above < 0) {
      // Wrap
      above = grid.length - Math.abs(0 - above)
    }
    grid[above][col] = temp[invert][col]
  }
}

export const mirror = (arr: string | any[]) => {
  let halfway = Math.floor(arr.length / 2)
  let temp = new Array(arr.length).fill(false)

  for (let i = 0; i < arr.length; i++) {
    if (i < halfway) {
      temp[i] = arr[i]
    } else {
      temp[i] = arr[arr.length - i - 1]
    }
  }
  return temp
}

export const ftom = (x: any) => {
  return Math.log2(x / 440.0) + 69.0
}

export const mtof = (x: any) => {
  return Math.pow(2, x - 69.0) * 440
}
