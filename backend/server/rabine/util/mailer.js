import logger from 'utils/logger';

const Fs = require('fs');
const Path = require('path');
const Boom = require('boom');
const Util = require('util');
const Nodemailer = require('nodemailer');
const Handlebars = require('handlebars');
const HtmlToText = require('html-to-text');
const sgTransport = require('nodemailer-sendgrid-transport');
const { productName, primaryEmail, sgApiUser, sgApiKey } = require('../constants');

const ReadFile = Util.promisify(Fs.readFile);
const options = {
  auth: {
    api_user: sgApiUser,
    api_key: sgApiKey
  }
};
const Transporter = Nodemailer.createTransport(sgTransport(options));
const Templates = Path.resolve(__dirname, '..', 'email-templates');

async function prepareTemplate(filename, templateOptions = {}) {
  const newOptions = {
    ...templateOptions,
    productName
  };
  try {
    const templatePath = Path.resolve(Templates, `${filename}.html`);
    const content = await ReadFile(templatePath, 'utf8');

    const template = Handlebars.compile(content);
    const html = template(newOptions);
    const text = HtmlToText.fromString(html);

    return {
      html,
      text
    };
  } catch (error) {
    throw new Boom('Cannot read the email template content.');
  }
}

exports.send = async (template, user, subject, data) => {
  const { html, text } = await prepareTemplate(template, data);
  const mailOptions = {
    from: `${productName} <${primaryEmail}>`,
    to: user.email,
    subject: subject,
    html,
    text
  };

  try {
    await Transporter.sendMail(mailOptions);
  } catch (err) {
    logger.info(err);
  }
};
