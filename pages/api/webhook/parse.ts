import { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';
import { simpleParser, ParsedMail } from 'mailparser';
import getRawBody from 'raw-body';

// Initialize Supabase
const supabaseUrl = 'https://wrldtznrubxbyxpxodst.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndybGR0em5ydWJ4Ynl4cHhvZHN0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzEyMTE3OTQsImV4cCI6MjA0Njc4Nzc5NH0.XgyOZqzk9c9IyupxsbWewQ8wCUQRrY9y9p9KdrO1jZc';
const supabase = createClient(supabaseUrl, supabaseKey);

export const config = {
  api: {
    bodyParser: false, // Disable Next.js default body parser
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    const body = await getRawBody(req);
    const parsed: ParsedMail = await simpleParser(body);
  
    console.log('Parsed Email:', parsed);
  
    const emailData = {
      from: parsed.from?.text || 'Unknown sender',
      to: Array.isArray(parsed.to)
        ? parsed.to.map(addr => addr.text).join(', ')
        : parsed.to?.text || 'Unknown recipient',
      subject: parsed.subject || null,
      text: parsed.text || null,
      html: parsed.html || null,
      attachments: parsed.attachments
        ? parsed.attachments.map(att => ({
            filename: att.filename || 'Unknown',
            contentType: att.contentType,
            size: att.size,
          }))
        : null,
    };
  
    console.log('Email Data:', emailData);
  
    const { error } = await supabase.from('parsemails').insert([{
      from_email: emailData.from,
      to_email: emailData.to,
      subject: emailData.subject,
      text_content: emailData.text,
      html_content: emailData.html,
      attachments: emailData.attachments ? JSON.stringify(emailData.attachments) : null,
    }]);
  
    if (error) {
      console.error('Supabase Error:', error);
    } else {
      console.log('Email saved successfully!');
    }
  
    res.status(200).json({ message: 'Email processed successfully' });
  } catch (err) {
    console.error('Processing Error:', err);
    res.status(500).json({ error: 'Failed to process email' });
  }
}