import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { simpleParser, ParsedMail } from 'mailparser';

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseKey = process.env.SUPBASE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export const config = {
  runtime: 'edge',
};

export default async function handler(req: NextRequest): Promise<Response> {
  const url = new URL(req.url);
  const key = url.searchParams.get('key');

  if (key !== process.env.WEBHOOK_SECRET) {
    console.warn('Invalid secret key:', key);
    return NextResponse.json({ error: 'Invalid secret key' }, { status: 401 });
  }

  if (req.method !== 'POST') {
    return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
  }

  try {
    const body = await req.text(); // Get raw body
    const parsed: ParsedMail = await simpleParser(body);

    // Extract spam-related headers
    const spamFlag: boolean = parsed.headers.get('x-spam-flag') === 'YES';
    const spamScore: number = parseFloat(parsed.headers.get('x-spam-score') as string) || 0;

    // Build email data
    const emailData = {
      from: parsed.from?.text || 'Unknown sender',
      to: parsed.to?.text || 'Unknown recipient',
      subject: parsed.subject || null,
      text: parsed.text || null,
      html: parsed.html || null,
      attachments: parsed.attachments?.map(att => ({
        filename: att.filename || 'Unknown',
        contentType: att.contentType,
        size: att.size,
      })) || null,
      spamFlag,
      spamScore,
    };

    // Save to Supabase
    const { error } = await supabase.from('emails').insert([
      {
        from_email: emailData.from,
        to_email: emailData.to,
        subject: emailData.subject,
        text_content: emailData.text,
        html_content: emailData.html,
        attachments: emailData.attachments ? JSON.stringify(emailData.attachments) : null,
        spam_flag: emailData.spamFlag,
        spam_score: emailData.spamScore,
      },
    ]);

    if (error) {
      console.error('Error saving to Supabase:', error);
      return NextResponse.json({ error: 'Failed to store email data' }, { status: 500 });
    }

    return NextResponse.json({ message: 'Webhook processed and data stored in Supabase' });
  } catch (err) {
    console.error('Error processing email:', err);
    return NextResponse.json({ error: 'Failed to process email' }, { status: 500 });
  }
}
