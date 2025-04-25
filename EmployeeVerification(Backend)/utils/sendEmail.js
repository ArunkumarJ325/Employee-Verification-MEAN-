const { getMaxListeners } = require('events');
const nodemailer = require('nodemailer');

const sendEmail = async (to, subject, text) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'arulmuruganarjun1414@gmail.com',
      pass: 'ztfq ktho tihj yunv'
    }
  });

  await transporter.sendMail({
    from: `"Verification Portal" <${'arulmuruganarjun1414@gmail.com'}>`,
    to,
    subject,
    text
  });
};

module.exports = sendEmail;
