export default (object) => {
  const array = Object.keys(object).map((key) => object[key]);
  console.log("🚀 ~ file: objToArray.js ~ line 4 ~ array", array);
  return array;
};
