import { Product } from '../models/product.model';
import products from '../mocks/products.json';

export const findProductById = (id: string): Promise<Product> => {
  const promise = new Promise<Product>((resolve) => resolve(products.find(product => product.id === id)));
  return promise;
};

export const findAllProducts = (): Promise<Product[]> => {
  const promise = new Promise<Product[]>((resolve) => resolve(products));
  return promise; 
};
