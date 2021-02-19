import axios from "axios";
import objToArray from "../utils/objToArray";

const crawler = async (startUrl, maxDepth, maxTotalPages) => {
  const data = (
    await axios.get("http://localhost:3000", {
      params: {
        startUrl,
        maxDepth,
        maxTotalPages,
      },
    })
  ).data;
  return objToArray(data).sort((a, b) => a.depth - b.depth);
};
export { crawler };
