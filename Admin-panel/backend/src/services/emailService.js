const nodemailer = require('nodemailer');

class EmailService {
  constructor() {

    const host = process.env.MAIL_HOST || 'smtp.gmail.com';
    const port = Number(process.env.MAIL_PORT || 587);
    const user = process.env.MAIL_USER || process.env.EMAIL_USER;
    const pass = process.env.MAIL_PASS || process.env.EMAIL_PASS;

    this.enabled = String(process.env.EMAIL_ENABLED || 'true').toLowerCase() === 'true';
    this.fromName = process.env.EMAIL_FROM_NAME || 'Ambulance Service';
    this.fromAddress = user;

    this.transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: { user, pass }
    });
  }

  async sendOTP(email, otp, bookingId) {
    try {
      if (!this.enabled) return { success: false, skipped: true };

      const mailOptions = {
        from: `"${this.fromName}" <${this.fromAddress}>`,
        to: email,
        subject: 'Your Ambulance Booking OTP',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: #dc2626; color: white; padding: 20px; text-align: center;">
              <h1>Ambulance Service OTP</h1>
            </div>
            <div style="padding: 20px; background: #f9f9f9;">
              <h2>Your OTP Code</h2>
              <div style="background: white; padding: 20px; text-align: center; border: 2px solid #dc2626; margin: 20px 0;">
                <h1 style="color: #dc2626; font-size: 32px; margin: 0;">${otp}</h1>
              </div>
              <p><strong>Booking ID:</strong> ${bookingId}</p>
              <p><strong>Valid for:</strong> 10 minutes</p>
              <p>Do not share this code with anyone.</p>
            </div>
          </div>
        `
      };

      const info = await this.transporter.sendMail(mailOptions);
      return {
        success: true,
        messageId: info.messageId,
        sentTo: email
      };
    } catch (error) {
      throw new Error('Failed to send OTP email: ' + error.message);
    }
  }

  async sendBookingConfirmation(email, booking) {
    try {
      if (!this.enabled) return { success: false, skipped: true };

      const mailOptions = {
        from: `"${this.fromName}" <${this.fromAddress}>`,
        to: email,
        subject: 'Booking Confirmation - Ambulance Service',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: #16a34a; color: white; padding: 20px; text-align: center;">
              <h1>Booking Confirmed</h1>
            </div>
            <div style="padding: 20px;">
              <p><strong>Booking ID:</strong> ${booking._id}</p>
              <p><strong>Emergency Level:</strong> ${booking.emergencyLevel}</p>
              <p><strong>Status:</strong> ${booking.status}</p>
              <p><strong>Created:</strong> ${new Date(booking.createdAt).toLocaleString()}</p>
            </div>
          </div>
        `
      };

      const info = await this.transporter.sendMail(mailOptions);
      return {
        success: true,
        messageId: info.messageId
      };
    } catch (error) {
      throw new Error('Failed to send confirmation email: ' + error.message);
    }
  }

  async testEmailConfig() {
    try {
      if (!this.enabled) return { success: false, skipped: true };
      await this.transporter.verify();
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
}

module.exports = new EmailService();