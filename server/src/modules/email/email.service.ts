import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

export const sendWelcomeEmail = async (to: string) => {
    try {
        console.log(`[EMAIL] Attempting to send email to: ${to}`);
        console.log(`[EMAIL] Using sender: ${process.env.EMAIL_USER}`);

        const result = await transporter.sendMail({
            from: `"ChatCV Team 🚀" <${process.env.EMAIL_USER}>`,
            to,
            subject: "You're on the list! Welcome to the future of resumes 📄✨",
            html: `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { 
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
          line-height: 1.6; 
          color: #e2e8f0; 
          background-color: #0f172a; 
          margin: 0; 
          padding: 0; 
        }
        .container { 
          max-width: 600px; 
          margin: 20px auto; 
          background-color: #111111;
          border: 1px solid #22c55e33; 
          border-radius: 16px; 
          overflow: hidden; 
        }
        .header { 
          background: #111111; 
          padding: 50px 20px; 
          text-align: center; 
          border-bottom: 1px solid #1f2937;
        }
        .header h1 { 
          color: #ffffff; 
          font-size: 32px;
          margin: 0;
        }
        .accent-green { 
          color: #22c55e; 
        }
        .content { 
          padding: 40px 30px; 
        }
        .feature-card { 
          background: #1a1a1a; 
          border-radius: 12px; 
          padding: 20px; 
          margin-bottom: 20px; 
          border: 1px solid #262626;
          border-left: 4px solid #22c55e; 
        }
        .feature-card strong {
          color: #22c55e;
        }
        .footer { 
          background: #0a0a0a; 
          padding: 25px; 
          text-align: center; 
          font-size: 12px; 
          color: #64748b; 
          border-top: 1px solid #1f2937;
        }
        h2, h3 { 
          color: #ffffff; 
          margin-top: 0; 
        }
        p {
          color: #94a3b8;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Chat<span class="accent-green">CV</span></h1>
          <p style="font-size: 16px; color: #22c55e; opacity: 0.9; margin-top: 10px; font-weight: bold; letter-spacing: 1px;">ELITE CAREERS ON AUTOPILOT</p>
        </div>

        <div class="content">
          <h2>Hi there,</h2>
          <p>Thanks for joining the early access list for <strong>ChatCV</strong>. You’re officially in line to experience the simplest way to build a professional career profile.</p>
          
          <hr style="border: 0; border-top: 1px solid #1f2937; margin: 25px 0;">

          <h3>Why ChatCV?</h3>
          
          <div class="feature-card">
            <strong>🚫 The Problem</strong>
            <p style="margin: 5px 0 0; font-size: 14px;">Traditional builders are a nightmare. Dealing with rigid forms or wrestling with LaTeX code takes hours away from your job search.</p>
          </div>

          <div class="feature-card">
            <strong>✅ Our Solution</strong>
            <p style="margin: 5px 0 0; font-size: 14px;">An AI-powered agent that builds your resume through <strong>simple chat</strong>. It manages the LaTeX backend so you get an ATS-optimized result without touching code.</p>
          </div>

          <p>We are currently polishing <strong>V1</strong> and will notify you the moment we go live. Get ready to ditch the templates and just start talking.</p>
          
          <div style="text-align: center; margin-top: 30px;">
            <p style="font-weight: bold; color: #ffffff;">Stay tuned—big things are coming! 🔥</p>
          </div>
        </div>

        <div class="footer">
          <p>&copy; 2026 ChatCV AI. Built for the modern engineer.</p>
          <p>Bengaluru, India | Follow our journey</p>
        </div>
      </div>
    </body>
    </html>
  `,
        });

        console.log(`[EMAIL] ✅ Email sent successfully to ${to}`, result.messageId);
    } catch (error) {
        console.error(`[EMAIL] ❌ Failed to send email to ${to}:`, error);
        throw error;
    }
};