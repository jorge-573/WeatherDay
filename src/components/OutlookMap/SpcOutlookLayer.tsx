import type { Feature } from 'geojson'
import type { Layer, PathOptions } from 'leaflet'
import { GeoJSON } from 'react-leaflet'
import type { SpcFeatureCollection, SpcFeatureProperties } from '../../types/outlooks'

function featureStyle(feature?: Feature): PathOptions {
  const properties = feature?.properties as SpcFeatureProperties | undefined
  const significant = properties?.label?.startsWith('CIG') ?? false

  return {
    color: properties?.stroke ?? '#ffffff',
    fillColor: properties?.fill ?? properties?.stroke ?? '#ffffff',
    fillOpacity: significant ? 0.18 : 0.55,
    opacity: 1,
    weight: significant ? 3 : 1.5,
    dashArray: significant ? '7 5' : undefined,
  }
}

function bindFeatureTooltip(feature: Feature, layer: Layer) {
  const properties = feature.properties as SpcFeatureProperties | undefined
  const label = properties?.label2 ?? properties?.label
  if (label) layer.bindTooltip(label, { sticky: true })
}

export function SpcOutlookLayer({ data }: { data: SpcFeatureCollection }) {
  return <GeoJSON data={data} style={featureStyle} onEachFeature={bindFeatureTooltip} />
}
