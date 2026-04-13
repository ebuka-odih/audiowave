import { ensureSchema, getPool } from './_db.js';

const parseBody = (req: any) => {
  if (!req.body) return {};
  if (typeof req.body === 'string') {
    try {
      return JSON.parse(req.body);
    } catch {
      return {};
    }
  }
  return req.body;
};

const send = (res: any, status: number, payload: unknown) => {
  res.status(status).json(payload);
};

export default async function handler(req: any, res: any) {
  try {
    await ensureSchema();
    const pool = getPool();

    if (req.method === 'GET') {
      const result = await pool.query(
        `SELECT id, name, weight, description, price, image
         FROM products
         ORDER BY created_at DESC`,
      );
      return send(res, 200, { products: result.rows });
    }

    const body = parseBody(req);

    if (req.method === 'POST') {
      const product = {
        id: crypto.randomUUID(),
        name: String(body.name ?? '').trim(),
        weight: String(body.weight ?? '').trim(),
        description: String(body.description ?? '').trim(),
        price: String(body.price ?? '').trim(),
        image: String(body.image ?? '').trim(),
      };

      if (!product.name || !product.description || !product.price) {
        return send(res, 400, { error: 'name, description, and price are required.' });
      }

      const result = await pool.query(
        `INSERT INTO products (id, name, weight, description, price, image)
         VALUES ($1, $2, $3, $4, $5, $6)
         RETURNING id, name, weight, description, price, image`,
        [product.id, product.name, product.weight, product.description, product.price, product.image],
      );

      return send(res, 201, { product: result.rows[0] });
    }

    if (req.method === 'PUT') {
      const id = String(req.query.id ?? body.id ?? '').trim();
      const product = {
        name: String(body.name ?? '').trim(),
        weight: String(body.weight ?? '').trim(),
        description: String(body.description ?? '').trim(),
        price: String(body.price ?? '').trim(),
        image: String(body.image ?? '').trim(),
      };

      if (!id) return send(res, 400, { error: 'id is required.' });
      if (!product.name || !product.description || !product.price) {
        return send(res, 400, { error: 'name, description, and price are required.' });
      }

      const result = await pool.query(
        `UPDATE products
         SET name = $2, weight = $3, description = $4, price = $5, image = $6, updated_at = NOW()
         WHERE id = $1
         RETURNING id, name, weight, description, price, image`,
        [id, product.name, product.weight, product.description, product.price, product.image],
      );

      if (result.rowCount === 0) return send(res, 404, { error: 'Product not found.' });
      return send(res, 200, { product: result.rows[0] });
    }

    if (req.method === 'DELETE') {
      const id = String(req.query.id ?? '').trim();
      if (!id) return send(res, 400, { error: 'id is required.' });

      const result = await pool.query('DELETE FROM products WHERE id = $1', [id]);
      if (result.rowCount === 0) return send(res, 404, { error: 'Product not found.' });
      return send(res, 200, { success: true });
    }

    res.setHeader('Allow', 'GET, POST, PUT, DELETE');
    return send(res, 405, { error: 'Method not allowed.' });
  } catch (error) {
    console.error(error);
    return send(res, 500, { error: 'Internal server error.' });
  }
}
