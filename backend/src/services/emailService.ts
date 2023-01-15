import nodemailer from 'nodemailer';
import User from '../database/models/User';

// Type definitions
interface EmailConfig {
  service: string;
  auth: {
    user: string;
    pass: string;
  };
}

interface MailOptions {
  from: string;
  to: string;
  subject: string;
  text: string;
}

interface EmailService {
  sendPasswordResetEmail(username: string, token: string): Promise<void>;
}

// Helper functions
const getEmailConfig = (): EmailConfig => ({
  service: process.env.EMAIL_SERVICE || 'gmail',
  auth: {
    user: process.env.EMAIL_USER || 'your-email@gmail.com',
    pass: process.env.EMAIL_PASSWORD || 'your-email-password',
  },
});

const createMailOptions = (
  emailConfig: EmailConfig,
  email: string | null,
  token: string
): MailOptions => ({
  from: `"Your App Name" <${emailConfig.auth.user}>`,
  to: email || emailConfig.auth.user,
  subject: 'Password Reset Request',
  text: `Click this link to reset your password: ${process.env.FRONTEND_URL}/reset-password?token=${token}`,
});

const sendEmail = async (transporter: nodemailer.Transporter, mailOptions: MailOptions) => {
  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Message sent: %s', info.messageId);
  } catch (error) {
    console.error('Error sending email:', error);
    throw new Error('Failed to send password reset email');
  }
};


const emailService: EmailService = {
  async sendPasswordResetEmail(username: string, token: string): Promise<void> {
    const user = await User.findOne({ where: { username } });
    
    if (!user) {
      console.log(`User ${username} not found - skipping email send`);
      return;
    }

    const emailConfig = getEmailConfig();
    const transporter = nodemailer.createTransport(emailConfig);
    const mailOptions = createMailOptions(emailConfig, user.email, token);

    await sendEmail(transporter, mailOptions);
  },
};

export default emailService;