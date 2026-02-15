import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

// Environment variables for email provider must be set
const transporter = nodemailer.createTransport({
    service: 'gmail', // or your SMTP provider
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

export async function POST(request) {
    const data = await request.json();
    const { userEmail, serviceName, totalCost, duration, location } = data;

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: userEmail,
        subject: `Invoice for ${serviceName} - Care.xyz`,
        text: `
      Thank you for your booking!
      
      Service: ${serviceName}
      Duration: ${duration} hours
      Location: ${location.area}, ${location.city}
      Total Cost: $${totalCost}
      
      Status: Pending
    `,
    };

    try {
        await transporter.sendMail(mailOptions);
        return NextResponse.json({ message: 'Invoice sent successfully' }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
    }
}