
export const isValidUUID = (id: string): boolean => {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
};

export const validateAgentIds = (agentIds: string[] = []): string[] => {
  return agentIds.filter(id => id && typeof id === 'string' && isValidUUID(id));
};

export const processFiles = (uploadedFiles: Array<any> = []) => {
  return uploadedFiles.map(file => ({
    name: file.name,
    type: file.type,
    size: file.size,
    url: file.preview || 'mock-url-for-' + file.name
  }));
};
