import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useLocalSearchParams } from 'expo-router';
import React from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const ProductDetailScreen: React.FC = () => {
  const { id } = useLocalSearchParams<{id: string}>();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>상품 상세보기</Text>
      </View>

      {/* id를 잘 받았는지 확인하기 위한 임시 코드 */}
      <Text style={{ padding: 20, fontSize: 16 }}>Received Product ID: {id}</Text>

      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <Image source={{ uri: 'https://via.placeholder.com/428x285' }} style={styles.mainImage} />

        <View style={styles.productInfoSection}>
          <Text style={styles.productTitle}>후쿠오카 놀러가실분</Text>
          <Text style={styles.productDetails}>
            2025.05.16 - 05.21{'\n'}
            4/10명       일본, 후쿠오카
          </Text>
          <Text style={styles.guideRating}>★★★★☆ 가이드 평점 4.0</Text>
          <View style={styles.guideProfile}>
            <Ionicons name="person-circle-outline" size={40} color="#999" />
            <Text style={styles.guideName}>박 대기 가이드</Text>
          </View>
        </View>

        <View style={styles.descriptionSection}>
          <Text style={styles.sectionTitle}>여행 소개</Text>
          <Text style={styles.descriptionText}>
            후쿠오카에서 4박 5일간 함께 여행하실 분을{'\n'}
            모집합니다!{'\n'}
            가까워서 금방 다녀오기에도 좋아요!{'\n'}
            하카타의 캐널 시티와 그 주변에서 주로{'\n'}
            활동할 것 같습니다.
          </Text>
          <Text style={styles.sectionTitle}>태그</Text>
          <Text style={styles.descriptionText}>
            #쇼핑 #음식 #일본 #후쿠오카 #하카타{'\n'}
            #해외여행
          </Text>
          <TouchableOpacity style={styles.scheduleButton}>
            <MaterialCommunityIcons name="calendar-month" size={24} color="#8130FF" />
            <Text style={styles.scheduleButtonText}>일정 확인하기</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <View style={styles.bottomActionContainer}>
        <TouchableOpacity style={styles.applyButton}>
          <Text style={styles.applyButtonText}>여행에 참여 신청하기</Text>
        </TouchableOpacity>
        {/* 신청됨 / 신청 취소하기 버튼은 조건부 렌더링 */}
        {/* <TouchableOpacity style={styles.appliedButton}>
          <Text style={styles.appliedButtonText}>신청됨</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.cancelApplyButton}>
          <Text style={styles.cancelApplyButtonText}>신청 취소하기</Text>
        </TouchableOpacity> */}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E9E9E9',
  },
  backButton: {
    marginRight: 10,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  scrollViewContent: {
    paddingBottom: 120, // 하단 액션 버튼 공간 확보
  },
  mainImage: {
    width: '100%',
    height: 285,
    resizeMode: 'cover',
  },
  productInfoSection: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E9E9E9',
  },
  productTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  productDetails: {
    fontSize: 24,
    color: '#000',
    marginBottom: 10,
  },
  guideRating: {
    fontSize: 20,
    color: '#000',
    marginBottom: 10,
  },
  guideProfile: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  guideName: {
    fontSize: 20,
    color: '#000',
    marginLeft: 10,
  },
  descriptionSection: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  descriptionText: {
    fontSize: 20,
    color: '#000',
    marginBottom: 20,
  },
  scheduleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    borderColor: '#949494',
    borderWidth: 1,
    borderRadius: 25,
    paddingVertical: 10,
    marginTop: 20,
  },
  scheduleButtonText: {
    fontSize: 20,
    color: '#8130FF',
    marginLeft: 10,
  },
  bottomActionContainer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    backgroundColor: '#fff',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderTopWidth: 1,
    borderTopColor: '#E9E9E9',
  },
  applyButton: {
    backgroundColor: '#8130FF',
    borderRadius: 5,
    height: 52,
    justifyContent: 'center',
    alignItems: 'center',
  },
  applyButtonText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  appliedButton: {
    backgroundColor: '#999',
    borderRadius: 5,
    height: 52,
    justifyContent: 'center',
    alignItems: 'center',
  },
  appliedButtonText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  cancelApplyButton: {
    backgroundColor: '#FF2525',
    borderRadius: 5,
    height: 52,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelApplyButtonText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
});

export default ProductDetailScreen;
