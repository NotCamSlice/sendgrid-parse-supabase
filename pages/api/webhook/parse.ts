import { NextApiRequest, NextApiResponse } from 'next';
import { simpleParser, ParsedMail } from 'mailparser';
import multer from 'multer';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://wrldtznrubxbyxpxodst.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndybGR0em5ydWJ4Ynl4cHhvZHN0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzEyMTE3OTQsImV4cCI6MjA0Njc4Nzc5NH0.XgyOZqzk9c9IyupxsbWewQ8wCUQRrY9y9p9KdrO1jZc';
const supabase = createClient(supabaseUrl, supabaseKey);

const upload = multer().none();

export const config = {
  api: {
    bodyParser: false, // Disable Next.js default body parser
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Parse the form-data payload
    await new Promise((resolve, reject) => {
      upload(req as any, {} as any, (err: any) => {
        if (err) return reject(err);
        resolve(null);
      });
    });

    // Get the raw email content
    const rawEmail = req.body.envelope || req.body['email'] || req.body['raw'];
    if (!rawEmail) {
      return res.status(400).json({ error: 'Raw email content not found in request' });
    }

    // Parse the raw email content
    const parsed: ParsedMail = await simpleParser(rawEmail);
    console.log('Parsed Email:', parsed);

    // Extract email data
    const emailData = {
      from_email: parsed.from?.text || 'Unknown sender',
      to_email: Array.isArray(parsed.to)
        ? parsed.to.map(addr => addr.text).join(', ')
        : parsed.to?.text || 'Unknown recipient',
      subject: parsed.subject || '(No Subject)',
      text_content: parsed.text || '(No Text Content)',
      html_content: parsed.html || '(No HTML Content)',
      attachments: parsed.attachments
        ? parsed.attachments.map(att => ({
            filename: att.filename || 'Unknown',
            contentType: att.contentType,
            size: att.size,
          }))
        : null,
    };

    console.log('Email Data:', emailData);

    // Save email data to Supabase
    const { error } = await supabase.from('parsemails').insert([
      {
        from_email: emailData.from_email,
        to_email: emailData.to_email,
        subject: emailData.subject,
        text_content: emailData.text_content,
        html_content: emailData.html_content,
        attachments: emailData.attachments ? JSON.stringify(emailData.attachments) : null,
      },
    ]);

    if (error) {
      console.error('Supabase Error:', error);
      return res.status(500).json({ error: 'Failed to save email data to Supabase' });
    }

    console.log('Email saved successfully!');
    res.status(200).json({ message: 'Email processed and saved successfully', emailData });
  } catch (err) {
    console.error('Processing Error:', err);
    res.status(500).json({ error: 'Failed to process email' });
  }
}
