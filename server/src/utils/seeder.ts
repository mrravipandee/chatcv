import { User } from '../modules/auth/models/user.model';
import { Resume } from '../modules/resume/models/resume.model';
import { ChatMessage } from '../modules/chat/models/chat-message.model';
import { VisitorSession } from '../modules/visitors/visitor.model';
import { ResumeDownload } from '../modules/resume/models/resume-download.model';
import { SystemError } from '../modules/errors/error.model';
import { Feedback } from '../modules/feedback/feedback.model';
import { ContactMessage } from '../modules/contact/contact.model';
import { Blog } from '../modules/blog/blog.model';
import fs from 'fs';
import path from 'path';
import mongoose from 'mongoose';

export const seedDatabase = async () => {
  try {
    const userCount = await User.countDocuments();
    if (userCount === 0) {
      console.log('[SEEDER] Database is empty. Commencing bootstrap seed...');

    // 1. Seed Users
    const usersData = [
      { name: 'Ravi Pandey', email: 'ravipandey@chatcv.com', role: 'admin', membership: 'premium', plan: 'pro', isVerified: true },
      { name: 'Sarah Connor', email: 'sarah@example.com', role: 'user', membership: 'free', plan: 'free', isVerified: true },
      { name: 'John Doe', email: 'john@example.com', role: 'user', membership: 'premium', plan: 'pro', isVerified: true },
      { name: 'Emma Watson', email: 'emma@example.com', role: 'user', membership: 'premium', plan: 'pro', isVerified: true },
      { name: 'Ken Masters', email: 'ken@example.com', role: 'user', membership: 'free', plan: 'free', isVerified: true },
      { name: 'Jane Miller', email: 'jane@example.com', role: 'user', membership: 'free', plan: 'free', isVerified: true },
      { name: 'Ryu Hoshi', email: 'ryu@example.com', role: 'user', membership: 'premium', plan: 'pro', isVerified: true },
      { name: 'Lara Croft', email: 'lara@example.com', role: 'user', membership: 'premium', plan: 'pro', isVerified: true },
    ];

    const users = [];
    for (let u of usersData) {
      const created = await User.create({
        ...u,
        passwordHash: '$2a$10$tMhC/aUa6v0Gg0oDk6kF/.k4hM8x15Z2R2x55Kq0S/K/Jt1a7Yp4G', // hashed 'password123'
        chatTokensUsed: Math.floor(Math.random() * 5),
        chatTokensLimit: u.membership === 'premium' ? 100 : 5,
        createdAt: new Date(Date.now() - Math.floor(Math.random() * 20) * 24 * 60 * 60 * 1000)
      });
      users.push(created);
    }

    console.log(`[SEEDER] Seeded ${users.length} users successfully.`);

    // 2. Seed Resumes
    const resumes = [];
    for (let i = 0; i < 6; i++) {
      const user = users[i % users.length];
      const resume = await Resume.create({
        userId: user._id,
        title: `${user.name}'s Resume`,
        data: {
          name: user.name,
          role: i % 2 === 0 ? 'Software Engineer' : 'Product Manager',
          email: user.email,
          phone: '+1 (555) 019-2834',
          location: 'San Francisco, CA',
          links: [{ label: 'LinkedIn', url: 'https://linkedin.com' }],
          summary: 'Experienced professional with a strong track record of success.',
          education: [{ degree: 'B.S. Computer Science', institution: 'State University', location: 'USA', startYear: '2018', endYear: '2022' }],
          skills: [{ category: 'Languages', items: ['TypeScript', 'JavaScript', 'Python'] }],
          projects: [{ name: 'ChatCV', tags: ['Next.js', 'Express'], bullets: ['Built the AI resume assistant'] }],
          experience: [{ role: 'Developer', company: 'Tech Inc', location: 'USA', startDate: '2022', endDate: 'Present', isCurrent: true, bullets: ['Led frontend rewrite'] }],
          achievements: [{ title: 'Employee of the Month' }]
        },
        createdAt: new Date(Date.now() - Math.floor(Math.random() * 15) * 24 * 60 * 60 * 1000)
      });
      resumes.push(resume);
    }
    console.log(`[SEEDER] Seeded ${resumes.length} resumes.`);

    // 3. Seed Chat Messages
    let msgCount = 0;
    for (let r of resumes) {
      const messages = [
        { role: 'user', message: 'Add React as a skill to my resume.' },
        { role: 'assistant', message: 'I have added React to your Skills section. Please review the preview.' },
        { role: 'user', message: 'Improve the summary to sound more professional.' },
        { role: 'assistant', message: 'Summary updated: "Driven Software Engineer with expertise in building scalable web apps..."' }
      ];
      for (let m of messages) {
        await ChatMessage.create({
          userId: r.userId,
          resumeId: r._id,
          role: m.role,
          message: m.message,
          createdAt: new Date(Date.now() - Math.floor(Math.random() * 10) * 24 * 60 * 60 * 1000)
        });
        msgCount++;
      }
    }
    console.log(`[SEEDER] Seeded ${msgCount} chat messages.`);



    // 5. Seed Downloads
    for (let i = 0; i < resumes.length; i++) {
      const resObj = resumes[i];
      const createdDate = new Date();
      createdDate.setDate(createdDate.getDate() - Math.floor(Math.random() * 10));

      await ResumeDownload.create({
        userId: resObj.userId,
        resumeId: resObj._id,
        title: resObj.title,
        format: 'PDF',
        userEmail: users[i % users.length].email,
        createdAt: createdDate,
        updatedAt: createdDate
      });
    }
    console.log(`[SEEDER] Seeded downloads.`);

    // 6. Seed System Errors
    const errors = [
      { error: 'Failed to compile LaTeX structure: Undefined control sequence', path: '/api/latex/compile', count: 12 },
      { error: 'Rate limit exceeded for OpenAI GPT completion', path: '/api/chat/message', count: 4 },
      { error: 'Subscription status sync failed with stripe webhook', path: '/api/payment/webhook', count: 2 },
    ];
    for (let e of errors) {
      await SystemError.create(e);
    }
    console.log(`[SEEDER] Seeded system error logs.`);

    // 7. Seed Feedback
    const feedbacks = [
      { name: 'Alex Johnson', email: 'alex@example.com', rating: 5, comment: 'Amazing tool! Saved me hours writing LaTeX structures.' },
      { name: 'Michael Scott', email: 'michael@dundermifflin.com', rating: 4, comment: 'Great product, but I need more template designs.' },
      { name: 'Dwight Schrute', email: 'dwight@example.com', rating: 5, comment: 'Flawless efficiency. Highly recommended for professionals.' }
    ];
    for (let f of feedbacks) {
      await Feedback.create(f);
    }
    console.log(`[SEEDER] Seeded user reviews feedback.`);

    // 8. Seed Contact Messages
    const messages = [
      { name: 'Toby Flenderson', email: 'toby@example.com', message: 'How do I download the LaTeX raw zip package?', status: 'unread' },
      { name: 'Jim Halpert', email: 'jim@example.com', message: 'Do you offer discount plans for corporate licenses?', status: 'unread' }
    ];
    for (let m of messages) {
      await ContactMessage.create(m);
    }
    console.log(`[SEEDER] Seeded support contact tickets.`);
    console.log('[SEEDER] Database bootstrap seed complete! 🚀');
    }

    // 8. Seed Visitor Sessions independently if empty
    const visitorSessionCount = await VisitorSession.countDocuments();
    if (visitorSessionCount === 0) {
      console.log('[SEEDER] Visitor sessions are empty. Seeding sessions...');
      const visitorCities = [
        { name: 'San Francisco', state: 'California', country: 'United States', lat: 37.7749, lng: -122.4194, tz: 'America/Los_Angeles', isp: 'Comcast Cable' },
        { name: 'Bengaluru', state: 'Karnataka', country: 'India', lat: 12.9716, lng: 77.5946, tz: 'Asia/Kolkata', isp: 'Reliance Jio' },
        { name: 'London', state: 'England', country: 'United Kingdom', lat: 51.5074, lng: -0.1278, tz: 'Europe/London', isp: 'British Telecom' },
        { name: 'Berlin', state: 'Berlin', country: 'Germany', lat: 52.5200, lng: 13.4050, tz: 'Europe/Berlin', isp: 'Deutsche Telekom' },
        { name: 'Tokyo', state: 'Tokyo', country: 'Japan', lat: 35.6762, lng: 139.6503, tz: 'Asia/Tokyo', isp: 'Softbank Corp' }
      ];

      for (let i = 0; i < 25; i++) {
        const city = visitorCities[i % visitorCities.length];
        const referrer = i % 3 === 0 ? 'https://www.google.com/' : i % 3 === 1 ? 'https://www.producthunt.com/' : 'Direct';
        
        const createdDate = new Date();
        createdDate.setDate(createdDate.getDate() - Math.floor(Math.random() * 30));
        
        await VisitorSession.create({
          sessionId: `sess-seed-${i}`,
          ip: `192.168.${Math.floor(10 + Math.random() * 100)}.${Math.floor(1 + Math.random() * 250)}`,
          country: city.country,
          state: city.state,
          city: city.name,
          latitude: city.lat,
          longitude: city.lng,
          timezone: city.tz,
          isp: city.isp,
          browser: i % 2 === 0 ? 'Chrome' : 'Safari',
          browserVersion: '124.0',
          operatingSystem: i % 2 === 0 ? 'macOS' : 'Windows',
          screenResolution: '1440x900',
          deviceType: i % 4 === 0 ? 'Mobile' : 'Desktop',
          language: 'en-US',
          darkMode: i % 3 === 0,
          connectionType: 'Wifi',
          referrer,
          landingPage: '/',
          exitPage: i % 2 === 0 ? '/dashboard' : '/',
          sessionDuration: '1m 45s',
          sessionDurationSeconds: 105,
          pagesVisited: ['/', '/dashboard'],
          clicks: Math.floor(Math.random() * 8) + 2,
          scrollPercentage: Math.floor(40 + Math.random() * 55),
          utmSource: referrer !== 'Direct' ? (referrer.includes('google') ? 'google' : 'producthunt') : undefined,
          utmMedium: referrer !== 'Direct' ? 'organic' : undefined,
          utmCampaign: referrer !== 'Direct' ? 'summer_launch_2026' : undefined,
          userType: Math.random() > 0.3 ? 'New' : 'Returning',
          isBot: Math.random() > 0.95,
          timeline: [
            { id: `evt-${i}-1`, action: 'Page View', path: '/', timestamp: '12:04:12' },
            { id: `evt-${i}-2`, action: 'Click', path: '/', timestamp: '12:04:30', detail: 'Clicked Start Button' },
            { id: `evt-${i}-3`, action: 'Page View', path: '/dashboard', timestamp: '12:05:00' }
          ],
          createdAt: createdDate,
          updatedAt: createdDate
        });
      }
      console.log(`[SEEDER] Seeded 25 visitor sessions.`);
    }

    // 9. Seed Blog Posts if empty
    const blogCount = await Blog.countDocuments();
    if (blogCount === 0) {
      console.log('[SEEDER] Blog collection is empty. Checking for posts to seed...');
      const candidatePaths = [
        path.resolve(__dirname, '../../../client/src/content/blog/posts'),
        path.resolve(process.cwd(), '../client/src/content/blog/posts'),
        path.resolve(process.cwd(), 'client/src/content/blog/posts'),
      ];

      let postsDir = candidatePaths.find((p) => fs.existsSync(p));

      if (postsDir) {
        const files = fs.readdirSync(postsDir).filter((f) => f.endsWith('.json'));
        let seededBlogCount = 0;

        for (const file of files) {
          try {
            const raw = fs.readFileSync(path.join(postsDir, file), 'utf-8');
            const data = JSON.parse(raw);

            // Compute reading time if missing
            let readingTime = data.readingTime;
            if (!readingTime && Array.isArray(data.content)) {
              let words = 0;
              data.content.forEach((b: any) => {
                if (b.text) words += b.text.split(/\s+/).filter(Boolean).length;
                if (Array.isArray(b.items)) {
                  b.items.forEach((it: string) => (words += it.split(/\s+/).filter(Boolean).length));
                }
              });
              readingTime = Math.max(1, Math.ceil(words / 200));
            }

            await Blog.create({
              title: data.title,
              slug: data.slug,
              subtitle: data.subtitle || '',
              excerpt: data.excerpt,
              category: data.category,
              tags: data.tags || [],
              author: data.author,
              status: data.draft ? 'draft' : 'published',
              publishDate: data.publishDate ? new Date(data.publishDate) : new Date(),
              updatedDate: data.updatedDate ? new Date(data.updatedDate) : new Date(),
              readingTime: readingTime || 5,
              featuredImage: data.featuredImage,
              imageAltText: data.imageAltText || data.title,
              content: data.content || [],
              faqs: data.faqs || [],
              cta: data.cta,
              relatedPostsSlugs: data.relatedPostsSlugs || [],
              seo: data.seo || {},
              featured: !!data.featured,
              language: data.language || 'en',
              views: Math.floor(Math.random() * 250) + 25,
            });

            seededBlogCount++;
          } catch (postErr) {
            console.error(`[SEEDER] Error seeding blog file ${file}:`, postErr);
          }
        }
        console.log(`[SEEDER] Seeded ${seededBlogCount} blog posts successfully.`);
      } else {
        console.warn('[SEEDER] Blog posts directory not found in candidate paths.');
      }
    }
  } catch (err) {
    console.error('[SEEDER] Failed to seed database:', err);
  }
};
