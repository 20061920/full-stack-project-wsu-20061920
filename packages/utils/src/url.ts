export function toUrlPath(path: string) {
  return path
    .toLowerCase()                      
    .replace(/[^a-z0-9]/g, "-")           
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}
