// utils/fetchNearestStations.ts
export async function fetchNearestStations(lat: number, lng: number, apiKey: string) {
  const url = `https://api-v3.mbta.com/stops?filter[latitude]=${lat}&filter[longitude]=${lng}&sort=distance&api_key=${apiKey}`;

  const response = await fetch(url);
  if (!response.ok) throw new Error('Failed to fetch MBTA stops');

  const json = await response.json();
  return json.data.map((stop: any) => ({
    name: stop.attributes.name,
    type: stop.relationships.route?.data?.type || 'N/A',
    id: stop.id,
  }));
}
