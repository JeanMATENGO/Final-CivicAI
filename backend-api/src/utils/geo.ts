/**
 * Utility to check if a point (latitude, longitude) is within the borders of the DRC.
 * Approximated with a bounding box for this prototype.
 */
export const isWithinRDC = (latitude: number, longitude: number): boolean => {
  const minLat = -13.5;
  const maxLat = 5.5;
  const minLng = 12.0;
  const maxLng = 31.5;

  return (
    latitude >= minLat &&
    latitude <= maxLat &&
    longitude >= minLng &&
    longitude <= maxLng
  );
};
