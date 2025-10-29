import TemplateList from '@/components/common/TemplateList';
import { TemplateInfo } from '@/types/templates';
import React from 'react';
import { FlatListProps } from 'react-native';

/**
 * @interface GuideTemplateListProps
 * @extends Omit<FlatListProps<TemplateInfo>, 'data' | 'renderItem' | 'keyExtractor' | 'userRole'>
 *
 * 가이드 전용 템플릿 리스트 컴포넌트의 props입니다.
 * 공용 `TemplateList`의 props를 상속받지만, `userRole`은 내부적으로 'GUIDE'로 고정되므로 제외됩니다.
 */
interface GuideTemplateListProps
  extends Omit<
    FlatListProps<TemplateInfo>,
    'data' | 'renderItem' | 'keyExtractor' | 'userRole'
  > {
  /**
   * 리스트에 표시될 템플릿 데이터 배열입니다.
   */
  templates: TemplateInfo[];
}

/**
 * 가이드 전용 템플릿 리스트를 렌더링하는 컴포넌트입니다.
 *
 * 이 컴포넌트는 공용 `TemplateList` 컴포넌트의 래퍼(wrapper) 역할을 하며,
 * `userRole` prop을 'GUIDE'로 고정하여 가이드에게 맞는 탐색 경로와 기능을 제공합니다.
 *
 * @param {GuideTemplateListProps} props - 컴포넌트에 전달되는 props.
 * @returns {React.ReactElement} - `userRole`이 'GUIDE'로 설정된 `TemplateList` 컴포넌트.
 */
const GuideTemplateList: React.FC<GuideTemplateListProps> = ({
  templates,
  ...rest
}) => {
  return <TemplateList templates={templates} userRole='GUIDE' {...rest} />;
};

export default GuideTemplateList;
