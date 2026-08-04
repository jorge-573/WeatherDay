import { TileLayer, WMSTileLayer } from 'react-leaflet'
import type { RadarFrame } from '../../services/radar'

const RADAR_OPACITY = 0.7

type RadarFrameLayersProps = {
  frames: RadarFrame[]
  mountedCount: number
  visibleIndex: number
  onLoad: (index: number, id: string) => void
  onError: (index: number) => void
}

/** Renders only the mounted frames, showing the single visible one. */
export function RadarFrameLayers({ frames, mountedCount, visibleIndex, onLoad, onError }: RadarFrameLayersProps) {
  return (
    <>
      {frames.slice(0, mountedCount).map((frame, index) => {
        const { render } = frame
        const layerProps = {
          opacity: index === visibleIndex ? RADAR_OPACITY : 0,
          zIndex: 5,
          tileSize: render.tileSize,
          zoomOffset: render.zoomOffset ?? 0,
          bounds: render.bounds,
          // Every mounted frame reloads the viewport whenever the map moves, so
          // requesting tiles for intermediate pan/zoom states multiplies into a
          // burst that providers answer with 429s or dropped HTTP/2 streams.
          updateWhenZooming: false,
          updateWhenIdle: true,
          eventHandlers: {
            load: () => onLoad(index, frame.id),
            tileerror: () => onError(index),
          },
        }

        return render.type === 'wms' ? (
          <WMSTileLayer key={frame.id} url={render.url} params={render.params} {...layerProps} />
        ) : (
          <TileLayer key={frame.id} url={render.url} {...layerProps} />
        )
      })}
    </>
  )
}
