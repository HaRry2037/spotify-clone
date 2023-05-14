const nodemailer = require('nodemailer');

module.exports = class Email {
  constructor(user) {
    this.to = user.email;
    this.name = user.name;
    this.from = `Maqsud Tolipov - spotify.clone`;
  }

  newTransport() {
    return nodemailer.createTransport({
      host: 'sandbox.smtp.mailtrap.io',
      port: 2525,
      auth: {
        user: process.env.NMAILER_USER,
        pass: process.env.NMAILER_PASS,
      },
    });
  }

  async send(subject) {
    const html = '<h1>Welcome to Spotify 🎵</h1>';

    const mailOptions = {
      from: this.from,
      to: this.to,
      subject,
      html,
    };

    await this.newTransport().sendMail(mailOptions);
  }

  async sendWelcome() {
    await this.send('Welcome to Spotify');
  }
};
