import LocationSharingScreen from '@/components/common/LocationSharingScreen';
import { router, useLocalSearchParams } from 'expo-router';

const ViewLocationScreen = () => {
  const { id, roomId } = useLocalSearchParams<{
    id: string;
    roomId?: string;
  }>();

  if (!roomId) {
    return router.back();
  }

  return <LocationSharingScreen roomId={+roomId} />;
};

export default ViewLocationScreen;
