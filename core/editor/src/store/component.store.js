import { create } from 'zustand'
import { loader } from 'ridgejs'

const componentStore = create((set, get) => ({
  registry: [],

  init: async () => {
    await loader.confirmExternalsMemoized()
    set({
      registry: loader.getRegistry()
    })
  }
}))

export default componentStore
