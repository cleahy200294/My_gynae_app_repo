import { message } from 'antd';

const FIREBASE_FUNCTION_URL =
  'https://us-central1-mygynae-1ec61.cloudfunctions.net/sendPdfEmail';

export const sendPdf = async (req: {
  email: string;
  subject: string;
  file: Blob;
}) => {
  const formData = new FormData();
  formData.append('email', req.email);
  formData.append('subject', req.subject);
  formData.append('file', req.file, 'consultation.pdf');

  try {
    const res = await fetch(FIREBASE_FUNCTION_URL, {
      method: 'POST',
      body: formData,
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.error || 'Failed to send email');
    }

    return await res.json();
  } catch (error: any) {
    const msg = error.message || 'Network error.';
    message.error(msg);
    return { error: msg };
  }
};
