import MyPageScreen from '@/components/common/MyPageScreen';
import CustomSafeAreaView from '@/components/CustomSafeAreaView';
import React from 'react';

const TravelerMyPageScreen: React.FC = () => {
  return (
    <CustomSafeAreaView>
      <MyPageScreen />
    </CustomSafeAreaView>
  )
};

export default TravelerMyPageScreen;
