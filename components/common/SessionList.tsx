import { REGION_ID_TO_NAME_MAP } from '@/constants/Regions';
import { SessionInfo } from '@/types/sessions';
import { UserRole } from '@/types/users';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { FlatListProps, Text, View } from 'react-native';
import ProductList from './ProductList';

/**
 * @interface SessionListProps
 * @extends Omit<FlatListProps<SessionInfo>, 'data' | 'renderItem' | 'keyExtractor'> `FlatList`의 props를 상속받지만, 내부적으로 처리되는 props는 제외합니다.
 *
 * SessionList 컴포넌트에 전달되는 props입니다.
 */
interface SessionListProps
  extends Omit<
    FlatListProps<SessionInfo>,
    'data' | 'renderItem' | 'keyExtractor'
  > {
  /**
   * 리스트에 표시될 세션 데이터 배열입니다.
   */
  sessions: SessionInfo[];
  /**
   * 현재 사용자의 역할('GUIDE' 또는 'TRAVELER')입니다.
   * 이 역할에 따라 아이템 클릭 시 이동하는 경로가 달라집니다.
   */
  userRole: UserRole;
}

/**
 * 개별 세션 아이템의 UI를 렌더링하는 컴포넌트입니다.
 * @param {SessionInfo} session - 렌더링할 세션 정보.
 * @returns {React.ReactElement} - 세션 아이템의 JSX 엘리먼트.
 */
const SessionListElement = (session: SessionInfo) => (
  <>
    <Image
      source={{ uri: session.firstImageUrl }}
      style={{ width: 80, height: 80, borderRadius: 12, marginRight: 16 }}
      contentFit='cover'
    />
    <View className='flex-1'>
      <Text className='text-lg font-semibold text-gray-900 mb-1'>
        {session.title}
      </Text>
      <Text className='text-gray-600 mb-2'>
        {session.startDate} ~ {session.endDate}
      </Text>
      <View className='flex-row items-start'>
        <MaterialIcons
          name='person-outline'
          size={16}
          color='#6B7280'
          style={{ marginTop: 2 }}
        />
        <Text className='text-gray-600 ml-1 mr-4'>
          {session.currentParticipants}/{session.maxParticipants}명
        </Text>
        <Ionicons
          name='location-outline'
          size={16}
          color='#6B7280'
          style={{ marginTop: 2 }}
        />
        <Text
          className='text-gray-600 ml-1 flex-1'
          numberOfLines={2}
          ellipsizeMode='tail'
        >
          {(Array.isArray(session.regionIds) && session.regionIds.length > 0
            ? session.regionIds.map((id) => REGION_ID_TO_NAME_MAP[id])
            : (session as any).regionNames || []
          )
            .filter(Boolean)
            .join(', ')}
        </Text>
      </View>
    </View>
    <View
      className={`px-3 py-1 rounded-full ${
        session.status === 'RECRUITING'
          ? 'bg-purple-100'
          : session.status === 'RECRUITMENT_CLOSED'
          ? 'bg-orange-100'
          : session.status === 'COMPLETED'
          ? 'bg-green-100'
          : 'bg-gray-100'
      }`}
    >
      <Text
        className={`text-sm ${
          session.status === 'RECRUITING'
            ? 'text-purple-700'
            : session.status === 'RECRUITMENT_CLOSED'
            ? 'text-orange-700'
            : session.status === 'COMPLETED'
            ? 'text-green-700'
            : 'text-gray-600'
        }`}
      >
        {session.status === 'RECRUITING' && '모집중'}
        {session.status === 'RECRUITMENT_CLOSED' && '모집마감'}
        {session.status === 'IN_PROGRESS' && '진행중'}
        {session.status === 'COMPLETED' && '완료'}
      </Text>
    </View>
  </>
);

/**
 * 세션(여행) 목록을 표시하는 범용 컴포넌트입니다.
 * `ProductList`를 기반으로 하며, 사용자 역할에 따라 다른 탐색 경로를 제공합니다.
 * @param {SessionListProps} props - 컴포넌트에 전달되는 props.
 * @returns {React.ReactElement} - 렌더링된 세션 리스트 컴포넌트.
 */
const SessionList: React.FC<SessionListProps> = ({
  sessions,
  userRole,
  ...rest
}) => {
  return (
    <ProductList<SessionInfo>
      data={sessions}
      keyExtractor={(item) => item.sessionId.toString()}
      getHref={(item) => {
        if (userRole === 'GUIDE') {
          return {
            pathname: '/guide/session/[id]',
            params: { id: item.sessionId },
          };
        } else {
          return {
            pathname: '/traveler/trip/[id]',
            params: { id: item.sessionId },
          };
        }
      }}
      renderItemContent={SessionListElement}
      {...rest}
    />
  );
};

export default SessionList;
