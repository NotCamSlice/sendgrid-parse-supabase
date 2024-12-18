import { NextApiRequest, NextApiResponse } from 'next';
import multer from 'multer';
import { createClient } from '@supabase/supabase-js';

// Supabase client setup
const supabaseUrl = 'https://wrldtznrubxbyxpxodst.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndybGR0em5ydWJ4Ynl4cHhvZHN0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzEyMTE3OTQsImV4cCI6MjA0Njc4Nzc5NH0.XgyOZqzk9c9IyupxsbWewQ8wCUQRrY9y9p9KdrO1jZc';
const supabase = createClient(supabaseUrl, supabaseKey);

// Multer setup for parsing form-data
const upload = multer().none();

export const config = {
  api: {
    bodyParser: false, // Disable Next.js default body parser for form-data
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

    // Get the raw email from SendGrid payload
    const rawEmail = req.body.email;
    if (!rawEmail) {
      return res.status(400).json({ error: 'No email field found in payload' });
    }

    // Extract text/plain and text/html content
    let text_content = '(No Text Content)';
    let html_content = '(No HTML Content)';

    const parts = rawEmail.split('--'); // Split by multipart boundary
    for (const part of parts) {
      if (part.includes('Content-Type: text/plain')) {
        const textStart = part.indexOf('\r\n\r\n') + 4; // Skip headers
        text_content = part.slice(textStart).trim();
      } else if (part.includes('Content-Type: text/html')) {
        const htmlStart = part.indexOf('\r\n\r\n') + 4; // Skip headers
        html_content = part.slice(htmlStart).trim();
      }
    }

    // Extract other fields from SendGrid payload
    const emailData = {
      from_email: req.body.from || 'Unknown sender',
      to_email: req.body.to || 'Unknown recipient',
      subject: req.body.subject || '(No Subject)',
      text_content,
      html_content,
      attachments: req.body.attachments ? JSON.parse(req.body.attachments) : [],
    };

    console.log('Parsed Email Data:', emailData);

    // Save the email data to Supabase
    const { error } = await supabase.from('parsemails').insert([emailData]);
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
