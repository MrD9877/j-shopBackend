import { checkDate } from "../utility/checkGeneratedDifference.js";
import setUrls, { saveProduct } from "../utility/findImageUrl.js";

async function intigrateUrls(item, type) {
  const timeNow = Date.now();
  if (type === "products") {
    let returnItem = [];
    for (let i = 0; i < item.length; i++) {
      const product = item[i];
      const timeUrlLastGenerated = checkDate(product);
      if (timeUrlLastGenerated > 6) {
        const urls = await setUrls([...product.images]);
        product.imagesUrl.urls = [...urls];
        product.imagesUrl.generated = timeNow;
        await saveProduct(product);
        returnItem.push(product);
      } else {
        returnItem.push(product);
      }
    }
    return returnItem;
  } else if (type === "product") {
    const product = item;
    const timeUrlLastGenerated = checkDate(product);
    if (timeUrlLastGenerated > 6) {
      const urls = await setUrls(product.images);
      product.imagesUrl.urls = [...urls];
      product.imagesUrl.generated = timeNow;
    }
    await saveProduct(product);
    return product;
  }
}
export default intigrateUrls;
