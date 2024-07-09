const fs = require('fs').promises; // Use fs.promises for async file operations
const nodemailer = require('nodemailer');
const handlebars = require('handlebars');
const path = require('path');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_SEND_ID,
    pass: process.env.EMAIL_SEND_PASSWORD,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

// Function to read HTML file and return promise
const readHTMLFile = (filePath) => {
  return fs.readFile(filePath, { encoding: 'utf-8' });
};

// Function to send email using Handlebars template
exports.sendForgetMail = async (req, data) => {
  try {
    // Read the HTML template file and compile it using Handlebars
    const html = await readHTMLFile(path.join(__dirname, `templates/${data.template}`));
    
    const template = handlebars.compile(html);
    const replacements = {
      clt_name: data.clt_name,
      vehicle: data.vehicle,
      cltEmail: data.cltEmail,
      location: data.location,
      number: data.number,
      vehiclename: data.vehiclename,
      service: data.service,
      companyLogo: data.companyLogo,
    };

    const mailOptions = {
      from: process.env.EMAIL_SEND_ID,
      to: data.email,
      subject: data.subject,
      html: template(replacements),
    };

    // Send the email using Nodemailer transporter
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent v2:', info.response);
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};
