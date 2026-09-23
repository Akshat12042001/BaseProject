export const getGeneratedLogoUrl = response => {
  if (typeof response?.data === 'string') {
    return response.data;
  }

  return (
    response?.logo ||
    response?.homestayLogo ||
    response?.url ||
    response?.imageUrl ||
    response?.data?.logo ||
    response?.data?.homestayLogo ||
    ''
  );
};
