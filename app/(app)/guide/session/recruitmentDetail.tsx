import FullScreenLoader from '@/components/ui/FullScreenLoader';
import { REGION_ID_TO_NAME_MAP } from '@/constants/Regions';
import { TAG_ID_TO_NAME_MAP } from '@/constants/Tags';
// import { useTemplateDetails } from '@/hooks/templates/useTemplateDetails'; // TODO: API 연동 시 사용
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
// import { useFocusEffect, useCallback } from 'expo-router'; // TODO: API 연동 시 사용
import React, { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  // RefreshControl, // TODO: API 연동 시 사용
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

/**
 * 모집 중인 여행의 상세 정보를 보여주는 화면입니다.
 * 제목, 소개, 지역, 태그, 일정 등을 확인하고 모집 취소/확정 기능을 제공합니다.
 */
const RecruitmentDetailScreen: React.FC = () => {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const { id } = useLocalSearchParams<{ id: string }>();

  // TODO: API 연동 후 제거 예정 - 현재는 샘플 데이터 사용
  const sampleData = {
    title: id === '1' ? '홍대 1박2일 모임' : '후쿠오카 놀러가실분',
    content:
      id === '1'
        ? '홍대에서 즐거운 1박2일을 함께 보내요! 맛있는 음식과 재미있는 활동들을 준비했어요. 친구들과 함께 추억을 만들어봐요.'
        : '일본 후쿠오카로 떠나는 5박6일 여행입니다. 현지 맛집 투어와 관광지를 함께 돌아보며 즐거운 시간을 보내요!',
    regionIds: id === '1' ? [1] : [2], // 1: 홍대, 2: 후쿠오카
    tagIds: id === '1' ? [1, 2, 3] : [2, 4, 5], // 다양한 태그
    imageUrls: [
      id === '1'
        ? 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop'
        : 'https://images.unsplash.com/photo-1542051841857-5f90071e7989?w=800&h=600&fit=crop',
    ],
    itineraries:
      id === '1'
        ? {
            1: [
              {
                id: 1,
                startTime: '10:00',
                title: '홍대역 2번 출구 집합',
                content: '모든 참가자분들께서 홍대역 2번 출구로 집합해주세요.',
              },
              {
                id: 2,
                startTime: '10:30',
                title: '홍대 카페 투어',
                content: '인기 카페들을 돌아보며 사진 촬영',
              },
              {
                id: 3,
                startTime: '12:00',
                title: '점심 식사',
                content: '홍대 맛집에서 점심 식사',
              },
              {
                id: 4,
                startTime: '14:00',
                title: '쇼핑',
                content: '홍대 상권 쇼핑 및 기념품 구매',
              },
              {
                id: 5,
                startTime: '16:00',
                title: '게임카페',
                content: '다양한 보드게임과 VR 체험',
              },
              {
                id: 6,
                startTime: '18:00',
                title: '저녁 식사',
                content: '홍대 맛집에서 저녁 식사',
              },
              {
                id: 7,
                startTime: '20:00',
                title: '홍대 나이트투어',
                content: '홍대의 밤거리와 클럽 문화 체험',
              },
            ],
            2: [
              {
                id: 8,
                startTime: '09:00',
                title: '아침 식사',
                content: '호텔에서 아침 식사',
              },
              {
                id: 9,
                startTime: '10:00',
                title: '이태원 관광',
                content: '이태원 거리 투어 및 사진 촬영',
              },
              {
                id: 10,
                startTime: '12:00',
                title: '점심 식사',
                content: '이태원 맛집에서 점심',
              },
              {
                id: 11,
                startTime: '14:00',
                title: '한강 공원',
                content: '한강에서 자전거 타기 및 피크닉',
              },
              {
                id: 12,
                startTime: '16:00',
                title: '반포 한강공원',
                content: '봉은사와 반포 한강공원 관광',
              },
              {
                id: 13,
                startTime: '18:00',
                title: '저녁 식사',
                content: '강남에서 저녁 식사',
              },
              {
                id: 14,
                startTime: '20:00',
                title: '해산',
                content: '모든 일정 마무리 및 해산',
              },
            ],
          }
        : {
            1: [
              {
                id: 1,
                startTime: '08:00',
                title: '인천공항 집합',
                content: '인천공항 1터미널 3층 출입구 집합',
              },
              {
                id: 2,
                startTime: '10:00',
                title: '항공편 탑승',
                content: '후쿠오카행 항공편 탑승',
              },
              {
                id: 3,
                startTime: '12:00',
                title: '후쿠오카 도착',
                content: '후쿠오카 공항 도착 및 입국',
              },
              {
                id: 4,
                startTime: '13:00',
                title: '호텔 체크인',
                content: '숙소 체크인 및 짐 정리',
              },
              {
                id: 5,
                startTime: '14:30',
                title: '점심 식사',
                content: '후쿠오카 라멘 맛집에서 점심',
              },
              {
                id: 6,
                startTime: '16:00',
                title: '텐진 상점가',
                content: '텐진 상점가 쇼핑 및 관광',
              },
              {
                id: 7,
                startTime: '18:00',
                title: '저녁 식사',
                content: '야타이(노점)에서 저녁 식사',
              },
              {
                id: 8,
                startTime: '20:00',
                title: '나카스 강변',
                content: '나카스 강변 야경 감상',
              },
            ],
            2: [
              {
                id: 9,
                startTime: '09:00',
                title: '아침 식사',
                content: '호텔에서 아침 식사',
              },
              {
                id: 10,
                startTime: '10:00',
                title: '오호리 공원',
                content: '오호리 공원 관광 및 사진 촬영',
              },
              {
                id: 11,
                startTime: '12:00',
                title: '점심 식사',
                content: '현지 맛집에서 점심',
              },
              {
                id: 12,
                startTime: '14:00',
                title: '후쿠오카 시청',
                content: '후쿠오카 시청 전망대 관광',
              },
              {
                id: 13,
                startTime: '16:00',
                title: '쇼핑',
                content: '카나몬 상점가 쇼핑',
              },
              {
                id: 14,
                startTime: '18:00',
                title: '저녁 식사',
                content: '이자카야에서 저녁 식사',
              },
            ],
            3: [
              {
                id: 15,
                startTime: '09:00',
                title: '아침 식사',
                content: '호텔에서 아침 식사',
              },
              {
                id: 16,
                startTime: '10:00',
                title: '다자이후 텐만구',
                content: '다자이후 텐만구 신사 관광',
              },
              {
                id: 17,
                startTime: '12:00',
                title: '점심 식사',
                content: '다자이후에서 점심',
              },
              {
                id: 18,
                startTime: '14:00',
                title: '규슈 국립 박물관',
                content: '규슈 국립 박물관 관람',
              },
              {
                id: 19,
                startTime: '16:00',
                title: '후쿠오카 타워',
                content: '후쿠오카 타워 전망대 관광',
              },
              {
                id: 20,
                startTime: '18:00',
                title: '저녁 식사',
                content: '마린 월드 근처에서 저녁',
              },
            ],
            4: [
              {
                id: 21,
                startTime: '09:00',
                title: '아침 식사',
                content: '호텔에서 아침 식사',
              },
              {
                id: 22,
                startTime: '10:00',
                title: '후쿠오카 성',
                content: '후쿠오카 성 관광',
              },
              {
                id: 23,
                startTime: '12:00',
                title: '점심 식사',
                content: '현지 맛집에서 점심',
              },
              {
                id: 24,
                startTime: '14:00',
                title: '아키즈키',
                content: '아키즈키 온천 마을 관광',
              },
              {
                id: 25,
                startTime: '16:00',
                title: '온천 체험',
                content: '전통 일본 온천 체험',
              },
              {
                id: 26,
                startTime: '18:00',
                title: '저녁 식사',
                content: '온천 마을에서 저녁',
              },
            ],
            5: [
              {
                id: 27,
                startTime: '09:00',
                title: '아침 식사',
                content: '호텔에서 아침 식사',
              },
              {
                id: 28,
                startTime: '10:00',
                title: '마린 월드',
                content: '후쿠오카 마린 월드 수족관 관광',
              },
              {
                id: 29,
                startTime: '12:00',
                title: '점심 식사',
                content: '마린 월드 근처에서 점심',
              },
              {
                id: 30,
                startTime: '14:00',
                title: '마지막 쇼핑',
                content: '공항 근처 쇼핑몰에서 쇼핑',
              },
              {
                id: 31,
                startTime: '16:00',
                title: '공항 이동',
                content: '후쿠오카 공항으로 이동',
              },
              {
                id: 32,
                startTime: '18:00',
                title: '출국',
                content: '인천공항으로 출발',
              },
            ],
          },
  };

  // TODO: API 연동 시 사용할 코드 (현재는 주석 처리)
  // const {
  //   title,
  //   content,
  //   regionIds,
  //   tagIds,
  //   imageUrls,
  //   itineraries,
  //   isLoading,
  //   refetch,
  // } = useTemplateDetails();

  // 샘플 데이터 사용 (API 연동 전까지)
  const title = sampleData.title;
  const content = sampleData.content;
  const regionIds = sampleData.regionIds;
  const tagIds = sampleData.tagIds;
  const imageUrls = sampleData.imageUrls;
  const itineraries = sampleData.itineraries;
  const isLoading = false; // 샘플 데이터는 로딩 없음
  // const refetch = () => {}; // 샘플 데이터는 새로고침 기능 없음

  // 로딩 상태 추가
  const [isCancelling, setIsCancelling] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);

  // 초기 로딩과 새로고침을 구분하기 위한 변수
  // 데이터가 전혀 없을 때의 로딩만 전체 화면 로딩으로 간주
  const isInitialLoading = isLoading && Object.keys(itineraries).length === 0;

  const availableDays = useMemo(
    () =>
      Object.keys(itineraries)
        .map(Number)
        .sort((a, b) => a - b),
    [itineraries]
  );

  const [selectedDay, setSelectedDay] = useState(
    availableDays.length > 0 ? availableDays[0] : 1
  );

  useEffect(() => {
    if (availableDays.length > 0 && !availableDays.includes(selectedDay)) {
      setSelectedDay(availableDays[0]);
    }
  }, [availableDays, selectedDay]);

  // TODO: API 연동 시 사용할 코드 (현재는 주석 처리)
  // useFocusEffect(
  //   useCallback(() => {
  //     // The id check is still useful here before refetching
  //     if (id) {
  //       refetch();
  //     }
  //   }, [id, refetch])
  // );

  const _id: number = +id;

  /**
   * 모집을 취소할지 확인하는 경고창을 띄우고, 확인 시 취소 API를 호출합니다.
   */
  const handleCancelRecruitment = () => {
    Alert.alert(
      '모집 취소',
      '정말 모집을 취소하시겠습니까? \n취소 후엔 복구할 수 없습니다.',
      [
        {
          text: '아니오',
          style: 'cancel',
        },
        {
          text: '취소하기',
          style: 'destructive',
          onPress: async () => {
            setIsCancelling(true);
            try {
              // TODO: 모집 취소 API 호출
              console.log('모집 취소:', _id);
              router.back();
            } catch (error) {
              console.error(error);
            } finally {
              setIsCancelling(false);
            }
          },
        },
      ]
    );
  };

  /**
   * 모집을 확정할지 확인하는 경고창을 띄우고, 확인 시 확정 API를 호출합니다.
   */
  const handleConfirmRecruitment = () => {
    Alert.alert(
      '모집 확정',
      '모집을 확정하시겠습니까? \n확정 후에는 참여자 수를 변경할 수 없습니다.',
      [
        {
          text: '취소',
          style: 'cancel',
        },
        {
          text: '확정하기',
          style: 'default',
          onPress: async () => {
            setIsConfirming(true);
            try {
              // TODO: 모집 확정 API 호출
              console.log('모집 확정:', _id);
              router.back();
            } catch (error) {
              console.error(error);
            } finally {
              setIsConfirming(false);
            }
          },
        },
      ]
    );
  };

  if (isInitialLoading) {
    return <FullScreenLoader />;
  }

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollViewContent}
        // TODO: API 연동 시 활성화
        // refreshControl={
        //   <RefreshControl refreshing={isLoading} onRefresh={refetch} />
        // }
      >
        <View style={styles.coverContainer}>
          {/* 배경 이미지 */}
          {imageUrls[0] && (
            <Image source={{ uri: imageUrls[0] }} style={styles.coverImage} />
          )}
          {/* 이미지가 없을 땐 이대로 그냥 회색 배경 */}
        </View>

        <View style={styles.section}>
          <Text style={styles.title}>{title}</Text>
          <View style={styles.metaRow}>
            <Ionicons name='location-outline' size={20} color='#8130FF' />
            <Text style={styles.metaText}>
              {regionIds
                .map((regionId) => REGION_ID_TO_NAME_MAP[regionId])
                .join(', ')}
            </Text>
          </View>
          <View style={styles.tagsRow}>
            {tagIds.map((tagId) => (
              <View key={tagId} style={styles.tagChip}>
                <Text style={styles.tagText}>
                  # {TAG_ID_TO_NAME_MAP[tagId]}
                </Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>여행 소개</Text>
          <Text style={styles.description}>{content}</Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>일정</Text>
        </View>

        <View style={styles.daySelection}>
          {availableDays.map((dayNumber) => (
            <TouchableOpacity
              key={dayNumber}
              style={[
                styles.dayButton,
                selectedDay === dayNumber && styles.dayButtonActive,
              ]}
              onPress={() => setSelectedDay(dayNumber)}
            >
              <Text
                style={[
                  styles.dayButtonText,
                  selectedDay === dayNumber && styles.dayButtonTextActive,
                ]}
              >
                {dayNumber}일차
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={[styles.section, { paddingTop: 0 }]}>
          {((itineraries as any)[selectedDay] || [])
            .sort((a: any, b: any) => a.startTime.localeCompare(b.startTime))
            .map((item: any) => (
              <View key={item.id} style={styles.itineraryItem}>
                <View style={styles.itineraryTime}>
                  <Text style={styles.itineraryTimeText}>
                    {item.startTime.substring(0, 5)}
                  </Text>
                </View>
                <View style={styles.itineraryContent}>
                  <Text style={styles.itineraryTitle}>{item.title}</Text>
                  {item.content ? (
                    <Text style={styles.itineraryDesc}>{item.content}</Text>
                  ) : null}
                </View>
              </View>
            ))}
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>

      {/* Fixed top action bar */}
      <View style={[styles.topBar, { top: insets.top + 10 }]}>
        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => router.back()}
        >
          <Ionicons name='arrow-back' size={24} color='#000' />
        </TouchableOpacity>
        <View style={styles.rightIcons}>
          <TouchableOpacity style={styles.iconCircle}>
            <Ionicons name='share-outline' size={20} color='#000' />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.bottomActionContainer}>
        <TouchableOpacity
          style={[styles.ctaButton, styles.secondaryButton]}
          onPress={handleCancelRecruitment}
          disabled={isCancelling}
        >
          {isCancelling ? (
            <ActivityIndicator size='small' color='#FF3B30' />
          ) : (
            <Text style={styles.secondaryButtonText}>모집 취소하기</Text>
          )}
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.ctaButton, styles.primaryButton]}
          onPress={handleConfirmRecruitment}
          disabled={isConfirming}
        >
          {isConfirming ? (
            <ActivityIndicator size='small' color='#fff' />
          ) : (
            <Text style={styles.primaryButtonText}>모집 확정하기</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollViewContent: {
    paddingBottom: 120,
  },
  coverContainer: {
    width: '100%',
    height: 280,
    backgroundColor: '#D9D9D9',
  },
  coverImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  topBar: {
    position: 'absolute',
    top: 50,
    left: 20,
    right: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.9)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  section: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },
  metaText: {
    fontSize: 16,
    marginLeft: 8,
    color: '#000',
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 12,
  },
  tagChip: {
    borderColor: '#949494',
    borderWidth: 1,
    borderRadius: 16,
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginRight: 8,
    marginBottom: 8,
  },
  tagText: {
    fontSize: 14,
    color: '#000',
  },
  divider: {
    height: 8,
    backgroundColor: '#F4F4F4',
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    lineHeight: 22,
    color: '#000',
    marginTop: 10,
  },
  daySelection: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: 10,
    backgroundColor: '#fff',
    paddingHorizontal: 20,
  },
  dayButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
    borderColor: '#949494',
    borderWidth: 1,
    marginHorizontal: 5,
  },
  dayButtonActive: {
    backgroundColor: '#8130FF',
    borderColor: '#8130FF',
  },
  dayButtonText: {
    fontSize: 16,
    color: '#8130FF',
  },
  dayButtonTextActive: {
    fontSize: 16,
    color: '#fff',
  },
  itineraryItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 12,
  },
  itineraryTime: {
    width: 70,
  },
  itineraryTimeText: {
    fontSize: 14,
    color: '#8130FF',
    fontWeight: 'bold',
  },
  itineraryContent: {
    flex: 1,
  },
  itineraryTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  itineraryDesc: {
    fontSize: 14,
    color: '#444',
    lineHeight: 20,
  },
  bottomActionContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#E9E9E9',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  ctaButton: {
    height: 52,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    flex: 1,
  },
  primaryButton: {
    backgroundColor: '#8130FF',
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  secondaryButton: {
    backgroundColor: '#F3ECFF',
    borderWidth: 1,
    borderColor: '#D9C7FF',
  },
  secondaryButtonText: {
    color: '#8130ff',
    fontSize: 16,
    fontWeight: '600',
  },
  rightIcons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.9)',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
});

export default RecruitmentDetailScreen;
