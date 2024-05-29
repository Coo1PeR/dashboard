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
// TODO split to different files
export interface UserFull extends User {
  totalPurchase: number;
  userFullName: string;
  profileImage?: string;
}

export interface User {
  address: {
    geolocation: {
      lat: number;
      long: number;
    };
    city: string;
    street: string;
    number: number;
    zipcode: string;
  }
  id: number;
  email: string;
  username: string;
  password: string;
  name: {
    firstname: string;
    lastname: string;
  };
  phone: string;
  __v: number
}
