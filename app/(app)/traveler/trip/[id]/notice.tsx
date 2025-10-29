import AnnounceScreen from '@/app/(app)/guide/session/[id]/announce';
import React from 'react';

/**
 * 여행자용 공지 목록 화면입니다.
 * 가이드가 작성한 공지를 조회할 수 있지만 작성/수정/삭제는 할 수 없습니다.
 */
const TravelerNoticeScreen: React.FC = () => {
  return <AnnounceScreen userType='traveler' />;
};

export default TravelerNoticeScreen;
