import { Stock } from '../../models/be/stock.model';
import { Product as ProductBE } from '../../models/be/product.model';
import { Product as ProductFE } from '../../models/fe/product.model';
import { getClient } from '../connect-db';

export const insertProduct = async (product: Omit<ProductFE, 'id'>): Promise<ProductFE> => {
  const { title, description, price, count } = product;
  if (!title || !description || !price || !count) {
    return null;
  }

  const client = getClient();
  await client.connect();

  try {
    await client.query('BEGIN');
    const created = (await client.query<ProductBE>(`
      INSERT INTO products (title, description, price)
      VALUES ($1, $2, $3)
      RETURNING *
    `, [title, description, price])).rows[0];
    const stock = (await client.query<Stock>(`
      INSERT INTO stocks (product_id, count)
      VALUES ($1, $2)
      RETURNING *
    `, [created.id, count])).rows[0];
    await client.query('COMMIT');
    return { ...created, count: stock.count };
  } catch (e) {
    console.error('Error during DB request executing: ' + e);
    await client.query('ROLLBACK');
    throw e;
  } finally {
    await client.end();
  }
};
