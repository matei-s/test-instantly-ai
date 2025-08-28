import DB from '../db/index.js';

export default async function routes(fastify, options) {
  fastify.get('/ping', async (request, reply) => {
    return 'pong\n';
  });

  // POST /email/send - Save email to database
  fastify.post('/email/send', async (request, reply) => {
    try {
      const { to, cc, bcc, subject, body } = request.body;

      // Basic validation
      if (!to || !subject || !body) {
        reply.status(400);
        return {
          error: 'Missing required fields: to, subject, and body are required'
        };
      }

      // Validate email format (basic check)
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(to)) {
        reply.status(400);
        return {
          error: 'Invalid email format for "to" field'
        };
      }

      // Save email to database
      const emailId = await DB.addEmail({
        to,
        cc: cc || null,
        bcc: bcc || null,
        subject,
        body
      });

      reply.status(201);
      return {
        success: true,
        message: 'Email saved successfully',
        emailId: emailId
      };
    } catch (error) {
      fastify.log.error(error);
      reply.status(500);
      return {
        error: 'Internal server error while saving email'
      };
    }
  });

  // GET /emails - Fetch all emails from database
  fastify.get('/emails', async (request, reply) => {
    try {
      const emails = await DB.getAllEmails();
      
      return {
        success: true,
        count: emails.length,
        emails: emails
      };
    } catch (error) {
      fastify.log.error(error);
      reply.status(500);
      return {
        error: 'Internal server error while fetching emails'
      };
    }
  });
}
