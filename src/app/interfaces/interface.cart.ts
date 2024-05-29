export interface ProductList {
  productId: number;
  quantity: number;
}

export interface Cart {

  "id": number,
  "userId": number,
  "date": string,
  "products": ProductList[],
  "__v": 0
}
