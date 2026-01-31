import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface MenuStore {
  hiddenIds: number[]
  toggleHidden: (id: number) => void
  showAll: () => void
}

export const useMenuStore = create<MenuStore>()(
  persist(
    (set) => ({
      hiddenIds: [],
      toggleHidden: (id) =>
        set((state) => ({
          hiddenIds: state.hiddenIds.includes(id)
            ? state.hiddenIds.filter((hiddenId) => hiddenId !== id)
            : [...state.hiddenIds, id],
        })),
      showAll: () => set({ hiddenIds: [] }),
    }),
    {
      name: 'menu-visibility-storage',
    }
  )
)
