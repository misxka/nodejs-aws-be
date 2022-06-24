import { Product } from '../models/fe/product.model';
import { getClient } from './connect-db';

export const findProductById = async (id: string): Promise<Product> => {
  const client = getClient();
  await client.connect();
  try {
    const { rows: products } = await client.query<Product>(`
      SELECT p.*, s.count FROM products p
      LEFT JOIN stocks s
      ON p.id = s.product_id
      WHERE p.id = '${id}'
    `);
    return products[0];
  } catch (e) {
    console.error('Error during DB request executing: ' + e);
  } finally {
    await client.end();
  }
};

export const findAllProducts = async (): Promise<Product[]> => {
  const client = getClient();
  await client.connect();
  try {
    const { rows: products } = await client.query<Product>(`
      SELECT p.*, s.count FROM products p
      LEFT JOIN stocks s
      ON p.id = s.product_id
    `);
    return products;
  } catch (e) {
    console.error('Error during DB request executing: ' + e);
  } finally {
    await client.end();
  }
};
