import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';

export default function GoogleMAP() {
  const containerStyle = {
    width: '100%',
    height: '100%',
    borderRadius: '30px',
  };

  const center = {
    lat: 42.516667,
    lng: 72.233333,
  };

  return (
    <div style={{ height: '100%', width: '100%', borderRadius: '30px' }}>
      <LoadScript googleMapsApiKey="AIzaSyD28KY3Z_QawvntkpyaIbdbBDeJQoG-WJw">
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={center}
          zoom={11}
        >
          <Marker position={{ lat: 49.955413, lng: 30.337844 }} />
        </GoogleMap>
      </LoadScript>
    </div>
  );
}