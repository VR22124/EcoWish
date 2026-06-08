export const getAnonymousUserId = (): string => {
  let userId = localStorage.getItem('ecowish_user_id');
  if (!userId) {
    userId = crypto.randomUUID();
    localStorage.setItem('ecowish_user_id', userId);
  }
  return userId;
};
