
export const createDataFormFromImageUri = (uri: string) => {
  const requestForm = new FormData();
  const filename = uri.split('/').pop();
  const match = /\.(\w+)$/.exec(filename || '');
  const type = match ? `image/${match[1]}` : 'image';

  // @ts-ignore: React Native의 FormData polyfill은 이 객체 구조를 파일로 인식합니다.
  requestForm.append('imageFile', {
    uri: uri,
    name: filename,
    type: type,
  });

  return requestForm;
}