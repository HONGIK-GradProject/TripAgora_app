import CustomSafeAreaView from '@/components/CustomSafeAreaView';
import MyPageScreen from '@/components/common/MyPageScreen';
import React from 'react';

const GuideMyPageScreen: React.FC = () => {
  return (
    <CustomSafeAreaView>
      <MyPageScreen />
    </CustomSafeAreaView>
  );
};

export default GuideMyPageScreen;
