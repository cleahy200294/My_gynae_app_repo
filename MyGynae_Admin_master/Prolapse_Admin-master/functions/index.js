const {setGlobalOptions} = require("firebase-functions");
const {onRequest} = require("firebase-functions/https");
const {defineSecret} = require("firebase-functions/params");
const logger = require("firebase-functions/logger");
const nodemailer = require("nodemailer");

setGlobalOptions({maxInstances: 10});

// Define secrets for Gmail credentials
const gmailUser = defineSecret("GMAIL_USER");
const gmailAppPassword = defineSecret("GMAIL_APP_PASSWORD");

exports.sendPdfEmail = onRequest(
    {cors: true, secrets: [gmailUser, gmailAppPassword]},
    async (req, res) => {
      if (req.method !== "POST") {
        res.status(405).send("Method not allowed");
        return;
      }

      try {
        if (!req.rawBody) {
          res.status(400).json({error: "Missing request body"});
          return;
        }

        // Parse multipart form data with Busboy
        const Busboy = require("busboy");
        let email = "";
        let subject = "";
        let fileBuffer = null;

        await new Promise((resolve, reject) => {
          // eslint-disable-next-line new-cap
          const busboy = Busboy({headers: req.headers});

          busboy.on("field", (fieldname, val) => {
            if (fieldname === "email") email = val;
            if (fieldname === "subject") subject = val;
          });

          busboy.on("file", (fieldname, file) => {
            const bufs = [];
            file.on("data", (data) => bufs.push(data));
            file.on("end", () => {
              fileBuffer = Buffer.concat(bufs);
            });
          });

          busboy.on("finish", resolve);
          busboy.on("error", reject);
          busboy.end(req.rawBody);
        });

        if (!email || !subject) {
          res.status(400).json({error: "Missing email or subject"});
          return;
        }

        if (!fileBuffer || fileBuffer.length === 0) {
          res.status(400).json({error: "No PDF file received"});
          return;
        }

        const transporter = nodemailer.createTransport({
          service: "gmail",
          auth: {
            user: gmailUser.value(),
            pass: gmailAppPassword.value(),
          },
        });

        const mailOptions = {
          from: gmailUser.value(),
          to: email,
          subject: subject,
          text: "Please find your consultation summary attached.",
          attachments: [
            {
              filename: `${subject}.pdf`,
              content: fileBuffer,
              contentType: "application/pdf",
            },
          ],
        };

        await transporter.sendMail(mailOptions);
        logger.info(`PDF email sent to ${email}`);
        res.status(200).json({message: "Email sent successfully"});
      } catch (error) {
        logger.error("Error sending email:", error);
        res.status(500).json({error: "Failed to send email"});
      }
    },
);
