import nextConnect from 'next-connect';
import multer from 'multer';

const formData = require('form-data');
const Mailgun = require('mailgun.js');

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const apiRoute = nextConnect({
  onError(error, req, res) {
    res.status(501).json({ error: `Sorry something Happened! ${error.message}` });
  },
  onNoMatch(req, res) {
    res.status(405).json({ error: `Method '${req.method}' Not Allowed` });
  }
});

apiRoute.use(upload.array('theFiles'));

apiRoute.post(async (req, res) => {
  const mailgun = new Mailgun(formData);

  const mg = mailgun.client({
    username: 'api',
    key: process.env.MAILGUN_API_KEY
  });

  const { originalname, buffer } = req.files[0];

  const emailToSend = {
    from: process.env.ADDRESS_FROM,
    to: process.env.ADDRESS_TO,
    subject: 'DEMO EMAIL: Next.js + Uploads + Mailgun',
    attachment: {
      filename: originalname,
      data: buffer
    },
    html: `<p style="white-space: pre-line">Lorem ipsum dolor sit amet consectetur adipisicing elit. Ipsa eos quis blanditiis aliquam ratione, explicabo non dolorem natus dignissimos magni ullam aut dolore ea qui voluptatem illo unde deserunt totam!</p>`
  };

  await mg.messages.create(process.env.MAILGUN_DOMAIN, emailToSend);

  res.status(200).json({ data: 'success' });
});

export default apiRoute;

export const config = {
  api: {
    bodyParser: false
  }
};
