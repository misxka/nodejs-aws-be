import { getClient } from '../connect-db';
import { Product } from '../../models/fe/product.model';

export const findProductById = async (id: string): Promise<Product> => {
  const client = getClient();
  await client.connect();
  try {
    const isValid = /^[0-9A-F]{8}-[0-9A-F]{4}-[4][0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i.test(id);
    if (!isValid) return null;

    const { rows: products } = await client.query<Product>(`
      SELECT p.*, s.count FROM products p
      LEFT JOIN stocks s
      ON p.id = s.product_id
      WHERE p.id = '${id}'
    `);
    return products[0];
  } catch (e) {
    console.error('Error during DB request executing: ' + e);
    throw e;
  } finally {
    await client.end();
  }
};
