
export const createFileFromImageUri = (uri: string) => {
  const filename = uri.split('/').pop();
  const match = /\.(\w+)$/.exec(filename || '');
  const type = match ? `image/${match[1]}` : 'image';

  return {
    uri: uri,
    name: filename,
    type: type,
  } as any;
}