import type { StateBounds } from '../types/outlooks'

export const CONUS_BOUNDS: [[number, number], [number, number]] = [
  [24.4, -125],
  [49.5, -66.5],
]

export const STATE_BOUNDS: StateBounds[] = [
  {
    code: 'AL',
    name: 'Alabama',
    bounds: [
      [30.1, -88.5],
      [35.1, -84.8],
    ],
  },
  {
    code: 'AZ',
    name: 'Arizona',
    bounds: [
      [31.3, -114.9],
      [37.1, -109],
    ],
  },
  {
    code: 'AR',
    name: 'Arkansas',
    bounds: [
      [33, -94.7],
      [36.6, -89.6],
    ],
  },
  {
    code: 'CA',
    name: 'California',
    bounds: [
      [32.5, -124.5],
      [42.1, -114.1],
    ],
  },
  {
    code: 'CO',
    name: 'Colorado',
    bounds: [
      [36.9, -109.1],
      [41.1, -102],
    ],
  },
  {
    code: 'CT',
    name: 'Connecticut',
    bounds: [
      [40.9, -73.8],
      [42.1, -71.8],
    ],
  },
  {
    code: 'DE',
    name: 'Delaware',
    bounds: [
      [38.4, -75.8],
      [39.9, -75],
    ],
  },
  {
    code: 'DC',
    name: 'District of Columbia',
    bounds: [
      [38.7, -77.2],
      [39, -76.9],
    ],
  },
  {
    code: 'FL',
    name: 'Florida',
    bounds: [
      [24.3, -87.7],
      [31.1, -79.8],
    ],
  },
  {
    code: 'GA',
    name: 'Georgia',
    bounds: [
      [30.3, -85.7],
      [35.1, -80.7],
    ],
  },
  {
    code: 'ID',
    name: 'Idaho',
    bounds: [
      [42, -117.3],
      [49.1, -111],
    ],
  },
  {
    code: 'IL',
    name: 'Illinois',
    bounds: [
      [36.9, -91.6],
      [42.6, -87.4],
    ],
  },
  {
    code: 'IN',
    name: 'Indiana',
    bounds: [
      [37.7, -88.1],
      [41.8, -84.7],
    ],
  },
  {
    code: 'IA',
    name: 'Iowa',
    bounds: [
      [40.3, -96.7],
      [43.6, -90.1],
    ],
  },
  {
    code: 'KS',
    name: 'Kansas',
    bounds: [
      [36.9, -102.1],
      [40.1, -94.5],
    ],
  },
  {
    code: 'KY',
    name: 'Kentucky',
    bounds: [
      [36.4, -89.7],
      [39.2, -81.9],
    ],
  },
  {
    code: 'LA',
    name: 'Louisiana',
    bounds: [
      [28.8, -94.1],
      [33.1, -88.7],
    ],
  },
  {
    code: 'ME',
    name: 'Maine',
    bounds: [
      [43, -71.1],
      [47.6, -66.8],
    ],
  },
  {
    code: 'MD',
    name: 'Maryland',
    bounds: [
      [37.8, -79.6],
      [39.8, -75],
    ],
  },
  {
    code: 'MA',
    name: 'Massachusetts',
    bounds: [
      [41.2, -73.6],
      [42.9, -69.8],
    ],
  },
  {
    code: 'MI',
    name: 'Michigan',
    bounds: [
      [41.6, -90.5],
      [48.4, -82.1],
    ],
  },
  {
    code: 'MN',
    name: 'Minnesota',
    bounds: [
      [43.4, -97.3],
      [49.4, -89.4],
    ],
  },
  {
    code: 'MS',
    name: 'Mississippi',
    bounds: [
      [30.1, -91.7],
      [35.1, -88.1],
    ],
  },
  {
    code: 'MO',
    name: 'Missouri',
    bounds: [
      [35.9, -95.8],
      [40.7, -89.1],
    ],
  },
  {
    code: 'MT',
    name: 'Montana',
    bounds: [
      [44.3, -116.1],
      [49.1, -104],
    ],
  },
  {
    code: 'NE',
    name: 'Nebraska',
    bounds: [
      [39.9, -104.1],
      [43.1, -95.3],
    ],
  },
  {
    code: 'NV',
    name: 'Nevada',
    bounds: [
      [35, -120.1],
      [42.1, -114],
    ],
  },
  {
    code: 'NH',
    name: 'New Hampshire',
    bounds: [
      [42.7, -72.6],
      [45.4, -70.6],
    ],
  },
  {
    code: 'NJ',
    name: 'New Jersey',
    bounds: [
      [38.8, -75.6],
      [41.4, -73.8],
    ],
  },
  {
    code: 'NM',
    name: 'New Mexico',
    bounds: [
      [31.3, -109.1],
      [37.1, -103],
    ],
  },
  {
    code: 'NY',
    name: 'New York',
    bounds: [
      [40.4, -79.8],
      [45.1, -71.7],
    ],
  },
  {
    code: 'NC',
    name: 'North Carolina',
    bounds: [
      [33.7, -84.4],
      [36.7, -75.3],
    ],
  },
  {
    code: 'ND',
    name: 'North Dakota',
    bounds: [
      [45.9, -104.1],
      [49.1, -96.5],
    ],
  },
  {
    code: 'OH',
    name: 'Ohio',
    bounds: [
      [38.3, -84.9],
      [42.1, -80.5],
    ],
  },
  {
    code: 'OK',
    name: 'Oklahoma',
    bounds: [
      [33.6, -103.1],
      [37.1, -94.4],
    ],
  },
  {
    code: 'OR',
    name: 'Oregon',
    bounds: [
      [41.9, -124.7],
      [46.3, -116.4],
    ],
  },
  {
    code: 'PA',
    name: 'Pennsylvania',
    bounds: [
      [39.7, -80.6],
      [42.6, -74.7],
    ],
  },
  {
    code: 'RI',
    name: 'Rhode Island',
    bounds: [
      [41.1, -71.9],
      [42.1, -71.1],
    ],
  },
  {
    code: 'SC',
    name: 'South Carolina',
    bounds: [
      [32, -83.4],
      [35.3, -78.4],
    ],
  },
  {
    code: 'SD',
    name: 'South Dakota',
    bounds: [
      [42.4, -104.1],
      [46.1, -96.4],
    ],
  },
  {
    code: 'TN',
    name: 'Tennessee',
    bounds: [
      [34.9, -90.4],
      [36.8, -81.6],
    ],
  },
  {
    code: 'TX',
    name: 'Texas',
    bounds: [
      [25.8, -106.7],
      [36.6, -93.5],
    ],
  },
  {
    code: 'UT',
    name: 'Utah',
    bounds: [
      [36.9, -114.1],
      [42.1, -109],
    ],
  },
  {
    code: 'VT',
    name: 'Vermont',
    bounds: [
      [42.7, -73.5],
      [45.1, -71.4],
    ],
  },
  {
    code: 'VA',
    name: 'Virginia',
    bounds: [
      [36.5, -83.8],
      [39.6, -75.1],
    ],
  },
  {
    code: 'WA',
    name: 'Washington',
    bounds: [
      [45.5, -124.9],
      [49.1, -116.8],
    ],
  },
  {
    code: 'WV',
    name: 'West Virginia',
    bounds: [
      [37.1, -82.7],
      [40.7, -77.7],
    ],
  },
  {
    code: 'WI',
    name: 'Wisconsin',
    bounds: [
      [42.4, -92.9],
      [47.1, -86.2],
    ],
  },
  {
    code: 'WY',
    name: 'Wyoming',
    bounds: [
      [40.9, -111.1],
      [45.1, -104],
    ],
  },
]
