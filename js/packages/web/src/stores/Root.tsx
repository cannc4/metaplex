import { useMemo } from 'react'
import {
  applySnapshot,
  Instance,
  onSnapshot,
  SnapshotIn,
  SnapshotOut,
  types,
  unprotect
} from 'mobx-state-tree'
import { Grid } from './Grid'
let store: IStore | undefined

const Root = types
  .model({
    activeGrid: types.optional(Grid, {}),
    appState: types.optional(types.string, 'active')
  })
  .views((self: any) => ({
    get getAppState() {
      return self.appState
    },
    get getGrid() {
      return self.grid
    }
  }))
  .actions((self: any) => ({
    async afterCreate() {

      unprotect(self)
    },
    setLock(flag: boolean) {
      self.isLocked = flag
    },
    setAppState(appState: string) {
      self.appState = appState
      console.log('AppState', self.appState)
    }
  }))

let initialState = Root.create()

// Get the latest UI state
if (typeof localStorage !== 'undefined') {
  const data = localStorage.getItem('rootState')
  if (data) {
    // console.log('Cookie store: ', data)
    const json = JSON.parse(data)
    if (Root.is(json)) {
      console.log('Loading local storage data.. ')
      initialState = Root.create(json as any)
    }
  }
}

export const root = initialState

onSnapshot(root, (snapshot) => {
  // console.log('Local Files:', snapshot.fileBrowser)
  // console.log('Snapshot: ', JSON.stringify(snapshot))
  localStorage.setItem('rootState', JSON.stringify(snapshot))
})

// onPatch(root, (patch) => {
//   if (patch.path.includes('AUDIOENGINE')) {
//     // console.log('JSONPatch:', patch.path)
//     root.sendJSONPatch(patch)
//   }
// })
export type IStore = Instance<typeof Root>
export type IStoreSnapshotIn = SnapshotIn<typeof Root>
export type IStoreSnapshotOut = SnapshotOut<typeof Root>

export function initializeStore(snapshot = null) {
  // Hydrate stores
  if (snapshot !== null) {
    applySnapshot(initialState, snapshot)
  }
  if (typeof window === 'undefined') return initialState
  // Create the store once in the client
  if (!store) store = initialState

  return store
}

export function useTreeState(initialState?: any) {
  const store = useMemo(() => initializeStore(initialState), [initialState])
  return store
}
