import Knex from 'knex';
import knexConfig from '../../knexfile.js';

const knex = Knex(knexConfig.development);

class DB {
  static async addLead(data) {
    return knex('leads').insert(data);
  }

  static async addEmail(emailData) {
    const [id] = await knex('emails').insert({
      to: emailData.to,
      cc: emailData.cc || null,
      bcc: emailData.bcc || null,
      subject: emailData.subject,
      body: emailData.body
    });
    return id;
  }

  static async getAllEmails() {
    return knex('emails').select('*').orderBy('created_at', 'desc');
  }
}

export default DB;
