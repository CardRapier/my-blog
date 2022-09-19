export const calculateSkip = (page: number): number => {
  return page ? (page - 1) * 10 : 0;
};
