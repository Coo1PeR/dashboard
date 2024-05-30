export interface Product {
  "id": number,
  "title": string,
  "price": number,
  "description": string,
  "category": string,
  "image": string,
  "rating": {
    "rate": number,
    "count": number
  }
}

export interface ProductCart {
  "price": number,
  "productId": number,
  "quantity": number,
  "sum": number,
  "title": string
}
