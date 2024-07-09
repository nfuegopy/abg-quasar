declare module 'jwt-decode' {
  function jwtDecode<T = unknown>(token: string): T;
  export default jwtDecode;
}
