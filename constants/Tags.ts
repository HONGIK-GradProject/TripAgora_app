export interface Tag {
  id: number;
  name: string;
}

export const INTEREST_TAGS: Tag[] = [
  { id: 1, name: '휴양·힐링' },
  { id: 2, name: '모험·액티비티' },
  { id: 3, name: '문화·역사·예술' },
  { id: 4, name: '쇼핑' },
  { id: 5, name: '클럽' },
  { id: 6, name: '카페투어' },
  { id: 7, name: '비즈니스' },
  { id: 8, name: '계획형' },
  { id: 9, name: '즉흥형' },
  { id: 10, name: '사교형' },
  { id: 11, name: '럭셔리형' },
  { id: 12, name: '가성비형' },
  { id: 13, name: '자연' },
  { id: 14, name: '도시' },
  { id: 15, name: '핫플' },
  { id: 16, name: '스포츠' },
  { id: 17, name: '인생샷' },
  { id: 18, name: '가족여행' },
  { id: 19, name: '커플여행' },
  { id: 20, name: '친구여행' },
  { id: 21, name: '혼자여행' },
];

/**
 * 태그 ID를 태그 이름에 매핑하는 객체입니다.
 * ID를 사용해 태그 이름을 O(1) 시간 복잡도로 효율적으로 조회하는 데 사용됩니다.
 */
export const TAG_ID_TO_NAME_MAP: Record<number, string> = INTEREST_TAGS.reduce(
  (acc, tag) => {
    acc[tag.id] = tag.name;
    return acc;
  },
  {} as Record<number, string>
);