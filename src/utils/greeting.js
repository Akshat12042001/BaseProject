export const getTimeBasedGreetingKey = (date = new Date()) => {
  const hour = date.getHours();

  if (hour >= 5 && hour < 12) {
    return 'HOME.GREETING_MORNING';
  }

  if (hour >= 12 && hour < 17) {
    return 'HOME.GREETING_AFTERNOON';
  }

  if (hour >= 17 && hour < 21) {
    return 'HOME.GREETING_EVENING';
  }

  return 'HOME.GREETING_NIGHT';
};
