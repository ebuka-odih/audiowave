import { ensureSchema, getPool } from './_db.js';
import { sendInquiryConfirmationEmail, sendInquiryEmail } from './_mail.js';

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
        `SELECT id, name, email, interest, message, created_at AS "createdAt"
         FROM consultation_requests
         ORDER BY created_at DESC`,
      );
      return send(res, 200, { requests: result.rows });
    }

    const body = parseBody(req);

    if (req.method === 'POST') {
      const request = {
        id: crypto.randomUUID(),
        name: String(body.name ?? '').trim(),
        email: String(body.email ?? '').trim(),
        interest: String(body.interest ?? '').trim(),
        message: String(body.message ?? '').trim(),
      };

      if (!request.name || !request.email || !request.interest || !request.message) {
        return send(res, 400, { error: 'name, email, interest, and message are required.' });
      }

      const result = await pool.query(
        `INSERT INTO consultation_requests (id, name, email, interest, message)
         VALUES ($1, $2, $3, $4, $5)
         RETURNING id, name, email, interest, message, created_at AS "createdAt"`,
        [request.id, request.name, request.email, request.interest, request.message],
      );

      const mailPayload = {
        name: request.name,
        email: request.email,
        interest: request.interest,
        message: request.message,
        createdAt: result.rows[0].createdAt,
      };

      const deliveryResults = await Promise.allSettled([
        sendInquiryEmail(mailPayload),
        sendInquiryConfirmationEmail(mailPayload),
      ]);

      deliveryResults.forEach((deliveryResult, index) => {
        if (deliveryResult.status === 'rejected') {
          const recipient = index === 0 ? 'admin' : 'requester';
          console.error(`Failed to send ${recipient} inquiry email`, deliveryResult.reason);
        }
      });

      return send(res, 201, { request: result.rows[0] });
    }

    if (req.method === 'PUT') {
      const id = String(req.query.id ?? body.id ?? '').trim();
      const request = {
        name: String(body.name ?? '').trim(),
        email: String(body.email ?? '').trim(),
        interest: String(body.interest ?? '').trim(),
        message: String(body.message ?? '').trim(),
      };

      if (!id) return send(res, 400, { error: 'id is required.' });
      if (!request.name || !request.email || !request.interest || !request.message) {
        return send(res, 400, { error: 'name, email, interest, and message are required.' });
      }

      const result = await pool.query(
        `UPDATE consultation_requests
         SET name = $2, email = $3, interest = $4, message = $5, updated_at = NOW()
         WHERE id = $1
         RETURNING id, name, email, interest, message, created_at AS "createdAt"`,
        [id, request.name, request.email, request.interest, request.message],
      );

      if (result.rowCount === 0) return send(res, 404, { error: 'Request not found.' });
      return send(res, 200, { request: result.rows[0] });
    }

    if (req.method === 'DELETE') {
      const id = String(req.query.id ?? '').trim();
      if (!id) return send(res, 400, { error: 'id is required.' });

      const result = await pool.query('DELETE FROM consultation_requests WHERE id = $1', [id]);
      if (result.rowCount === 0) return send(res, 404, { error: 'Request not found.' });
      return send(res, 200, { success: true });
    }

    res.setHeader('Allow', 'GET, POST, PUT, DELETE');
    return send(res, 405, { error: 'Method not allowed.' });
  } catch (error) {
    console.error(error);
    return send(res, 500, { error: 'Internal server error.' });
  }
}
