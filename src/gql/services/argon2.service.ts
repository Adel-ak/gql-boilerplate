import argon2 from 'argon2';

export const hashPassword = async (plainPassword: string) => {
  const hashedPass = await argon2.hash(plainPassword);
  return hashedPass;
};

export const comparePass = async (hashPassword: string, plainPassword: string) => {
  const isMatch = await argon2.verify(hashPassword, plainPassword);
  return isMatch;
};
