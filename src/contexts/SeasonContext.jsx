import { createContext, useContext, useState } from 'react'
import { getCurrentSeason } from '../utils/seasonUtils'

const SeasonContext = createContext()

export function SeasonProvider({ children }) {
  const [activeSeason, setActiveSeason] = useState(getCurrentSeason)
  return (
    <SeasonContext.Provider value={{ activeSeason, setActiveSeason }}>
      {children}
    </SeasonContext.Provider>
  )
}

export function useSeason() {
  return useContext(SeasonContext)
}
