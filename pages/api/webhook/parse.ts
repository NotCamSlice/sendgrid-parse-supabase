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
    // Parse the form-data payload from SendGrid
    await new Promise((resolve, reject) => {
      upload(req as any, {} as any, (err: any) => {
        if (err) return reject(err);
        resolve(null);
      });
    });

    // Log the incoming payload for debugging
    console.log('Incoming Payload:', req.body);

    // Extract fields from SendGrid's form-data
    const from_email = req.body.from || 'Unknown sender';
    const to_email = req.body.to || 'Unknown recipient';
    const subject = req.body.subject || '(No Subject)';
    const text_content = req.body.text || '(No Text Content)';
    const html_content = req.body.html || '(No HTML Content)';

    // Handle attachments
    const attachments = req.body.attachments ? JSON.parse(req.body.attachments) : [];

    // Construct email data
    const emailData = {
      from_email,
      to_email,
      subject,
      text_content,
      html_content,
      attachments,
    };

    console.log('Parsed Email Data:', emailData);

    // Save email data to Supabase
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
