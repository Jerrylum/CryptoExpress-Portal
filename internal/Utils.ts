
export function randomUUID() {
  let rtn = "";
  const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for (let i = 0; i < 16; i++) {
    rtn += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return rtn; 
}
