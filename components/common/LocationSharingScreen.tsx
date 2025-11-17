import LocationSharingView, { LocationSharingProps } from "../location-sharing/LocationView";

const LocationSharingScreen: React.FC<LocationSharingProps> = ({ roomId }) => {
  return (
    <LocationSharingView roomId={roomId}/>
  )
}

export default LocationSharingScreen;