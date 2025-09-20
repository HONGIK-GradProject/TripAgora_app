import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useLocalSearchParams } from 'expo-router';
import React from 'react';
import { Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';

const ProductDetailScreen: React.FC = () => {
  const { id } = useLocalSearchParams<{id: string}>();

  return (
    <View className="flex-1 bg-white">
      <View className="flex-row items-center px-5 pt-12 pb-2.5 border-b border-gray-200">
        <TouchableOpacity className="mr-2.5">
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text className="text-2xl font-bold">상품 상세보기</Text>
      </View>

      {/* id를 잘 받았는지 확인하기 위한 임시 코드 */}
      <Text className="p-5 text-base">Received Product ID: {id}</Text>

      <ScrollView contentContainerClassName="pb-32">
        <Image source={{ uri: 'https://via.placeholder.com/428x285' }} className="w-full h-72" />

        <View className="px-5 py-5 border-b border-gray-200">
          <Text className="text-4xl font-bold mb-2.5">후쿠오카 놀러가실분</Text>
          <Text className="text-2xl text-black mb-2.5">
            2025.05.16 - 05.21
            4/10명       일본, 후쿠오카
          </Text>
          <Text className="text-xl text-black mb-2.5">★★★★☆ 가이드 평점 4.0</Text>
          <View className="flex-row items-center">
            <Ionicons name="person-circle-outline" size={40} color="#999" />
            <Text className="text-xl text-black ml-2.5">박 대기 가이드</Text>
          </View>
        </View>

        <View className="px-5 py-5">
          <Text className="text-xl font-bold mb-2.5">여행 소개</Text>
          <Text className="text-xl text-black mb-5">
            후쿠오카에서 4박 5일간 함께 여행하실 분을
            모집합니다!
            가까워서 금방 다녀오기에도 좋아요!
            하카타의 캐널 시티와 그 주변에서 주로
            활동할 것 같습니다.
          </Text>
          <Text className="text-xl font-bold mb-2.5">태그</Text>
          <Text className="text-xl text-black mb-5">
            #쇼핑 #음식 #일본 #후쿠오카 #하카타
            #해외여행
          </Text>
          <TouchableOpacity className="flex-row items-center justify-center bg-white border border-gray-400 rounded-3xl py-2.5 mt-5">
            <MaterialCommunityIcons name="calendar-month" size={24} color="#8130FF" />
            <Text className="text-xl text-primary ml-2.5">일정 확인하기</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <View className="absolute bottom-0 w-full bg-white py-4 px-5 border-t border-gray-200">
        <TouchableOpacity className="bg-primary rounded-md h-14 justify-center items-center">
          <Text className="text-xl font-bold text-white">여행에 참여 신청하기</Text>
        </TouchableOpacity>
        {/* 신청됨 / 신청 취소하기 버튼은 조건부 렌더링 */}
        {/* <TouchableOpacity className="bg-gray-400 rounded-md h-14 justify-center items-center">
          <Text className="text-xl font-bold text-white">신청됨</Text>
        </TouchableOpacity>
        <TouchableOpacity className="bg-red-500 rounded-md h-14 justify-center items-center">
          <Text className="text-xl font-bold text-white">신청 취소하기</Text>
        </TouchableOpacity> */}
      </View>
    </View>
  );
};

export default ProductDetailScreen;