export const validarPrivilegio = (user, privilegio) => {
  if (!user) return false;
  if (user.role === "admin") return true;

  return user.privilegios.includes(privilegio);
};
