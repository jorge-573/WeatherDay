import { useLayoutEffect, type PropsWithChildren } from 'react'
import { TileLayer, useMap } from 'react-leaflet'
import { DARK_BASEMAP_ATTRIBUTION, DARK_BASEMAP_URL, DARK_REFERENCE_URL } from './basemap'

const LABEL_PANE = 'basemapLabels'

function BasemapLabels() {
  const map = useMap()

  useLayoutEffect(() => {
    if (map.getPane(LABEL_PANE)) return
    const pane = map.createPane(LABEL_PANE)
    // Above radar/outlook overlays (400), below markers and tooltips.
    pane.style.zIndex = '450'
    pane.style.pointerEvents = 'none'
  }, [map])

  return <TileLayer url={DARK_REFERENCE_URL} pane={LABEL_PANE} />
}

export function DarkBasemap({ children }: PropsWithChildren) {
  return (
    <>
      <TileLayer url={DARK_BASEMAP_URL} attribution={DARK_BASEMAP_ATTRIBUTION} />
      {children}
      <BasemapLabels />
    </>
  )
}
