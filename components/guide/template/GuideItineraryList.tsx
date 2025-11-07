import { TemplateItinerary } from '@/types/templates';
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useRef } from 'react';
import {
  FlatList,
  FlatListProps,
  ListRenderItem,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

// Omit<FlatListProps...>, 'data' | 'renderItem'> 를 상속받아
// data와 renderItem을 제외한 FlatList의 모든 props(예: ListHeaderComponent)를 받을 수 있도록 확장합니다.
interface GuideItineraryListProps
  extends Omit<FlatListProps<TemplateItinerary>, 'data' | 'renderItem'> {
  itineraries: TemplateItinerary[];
  onUpdate: (item: TemplateItinerary) => void;
  onDelete: (clientId: number) => void;
  onItemPress?: (item: TemplateItinerary) => void;
  selectedItineraryId?: number | null;
}

const GuideItineraryList: React.FC<GuideItineraryListProps> = ({
  itineraries,
  onUpdate,
  onDelete,
  onItemPress,
  selectedItineraryId,
  ...rest
}) => {
  const flatListRef = useRef<FlatList<TemplateItinerary>>(null);

  useEffect(() => {
    if (selectedItineraryId !== null) {
      const index = itineraries.findIndex((item) => item.id === selectedItineraryId);
      if (index !== -1) {
        flatListRef.current?.scrollToIndex({ animated: true, index });
      }
    }
  }, [selectedItineraryId, itineraries]);

  const renderItem: ListRenderItem<TemplateItinerary> = ({ item }) => {
    const isSelected = item.id === selectedItineraryId;

    return (
      <View className='flex-row mx-4 mb-4'>
        {/* 시간 정보 (왼쪽) */}
        <View className='justify-center mr-4 w-16'>
          <View className='bg-blue-50 px-2 py-1 rounded-lg items-center'>
            <Text className='text-sm font-bold text-blue-700'>
              {item.startTime.substring(0, 5)}
            </Text>
          </View>
        </View>

        {/* 메인 컨텐츠 (오른쪽 흰 박스) */}
        <View
          className={`flex-1 bg-white rounded-2xl border overflow-hidden ${
            isSelected ? 'border-purple-500' : 'border-gray-100'
          }`}
        >
          <TouchableOpacity
            onPress={() => onItemPress?.(item)}
            className='flex-1 p-4 active:bg-gray-50'
          >
            <View className='flex-row justify-between items-start'>
              <View className='flex-1 mr-3'>
                <Text className='text-lg font-bold text-gray-900 mb-1 leading-5'>
                  {item.location}
                </Text>
                <Text className='text-sm text-gray-600 leading-5'>
                  {item.content}
                </Text>
              </View>
              <View className='flex-row'>
                <TouchableOpacity
                  onPress={() => onUpdate(item)}
                  className='p-2 rounded-lg bg-gray-50 active:bg-gray-100 mr-1'
                >
                  <Ionicons name='pencil' size={16} color={'#6B7280'} />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => onDelete(item.id)}
                  className='p-2 rounded-lg bg-red-50 active:bg-red-100'
                >
                  <Ionicons name='trash-outline' size={16} color={'#EF4444'} />
                </TouchableOpacity>
              </View>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <FlatList
      ref={flatListRef}
      data={itineraries}
      renderItem={renderItem}
      keyExtractor={(item) => item.id.toString()}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingVertical: 20 }}
      {...rest}
    />
  );
};

export default GuideItineraryList;