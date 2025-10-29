import TemplateList from '@/components/common/TemplateList';
import { TemplateInfo } from '@/types/templates';
import React from 'react';
import { FlatListProps } from 'react-native';

interface GuideTemplateListProps
  extends Omit<
    FlatListProps<TemplateInfo>,
    'data' | 'renderItem' | 'keyExtractor' | 'userRole'
  > {
  templates: TemplateInfo[];
}

const GuideTemplateList: React.FC<GuideTemplateListProps> = ({
  templates,
  ...rest
}) => {
  return (
    <TemplateList
      templates={templates}
      userRole='GUIDE'
      {...rest}
    />
  )
};

export default GuideTemplateList;
