export default function toObject(array) {
  const objectExport = {};

  for (let index = 0; index < array.length; index += 1) {
    objectExport[array[index][0]] = array[index][1];
  }
  return objectExport;
}
