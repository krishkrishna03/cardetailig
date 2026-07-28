import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { MongoClient, ServerApiVersion } from 'mongodb';
import twilio from 'twilio';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = Number(process.env.PORT || 5000);
const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/detailpro';

app.use(cors());
app.use(express.json());

const fallbackData = {
  services: [
    { id: 'svc-1', title: 'Premium Wash', description: 'Exterior and interior detail', price: 120, category: 'wash' },
    { id: 'svc-2', title: 'Ceramic Coating', description: 'Long-lasting paint protection', price: 250, category: 'coating' },
  ],
  membershipPlans: [
    { id: 'm-1', name: 'Starter', price: 29, description: '1 monthly service' },
    { id: 'm-2', name: 'Pro', price: 69, description: '2 monthly services' },
  ],
  reviews: [
    { id: 'r-1', name: 'Ava', rating: 5, approved: true, message: 'Excellent service and fast scheduling.' },
  ],
  galleryItems: [{ id: 'g-1', title: 'Before & After', image: '/images/gallery-1.jpg' }],
  teamMembers: [{ id: 't-1', name: 'Alex', role: 'Lead Technician' }],
  blogPosts: [{ id: 'b-1', title: 'Car care tips', excerpt: 'Keep your car shining all year.' }],
  employees: [{ id: 'e-1', name: 'Jordan', role: 'Technician' }],
  inventory: [{ id: 'i-1', name: 'Wax', stock: 24 }],
  invoices: [{ id: 'inv-1', customer: 'Alice', amount: 180 }],
  coupons: [{ id: 'c-1', code: 'WELCOME10', discount: 10 }],
  customers: [{ id: 'cus-1', name: 'Alice', email: 'alice@example.com' }],
  customerBookings: [],
  adminBookings: [],
  dashboardStats: {
    todayRevenue: 28400,
    monthRevenue: 486000,
    bookings: 105,
    customers: 389,
    avgRating: 4.9,
    popularService: 'Premium Wash',
  },
};

const memoryStore = {
  services: [...fallbackData.services],
  membershipPlans: [...fallbackData.membershipPlans],
  reviews: [...fallbackData.reviews],
  galleryItems: [...fallbackData.galleryItems],
  teamMembers: [...fallbackData.teamMembers],
  blogPosts: [...fallbackData.blogPosts],
  employees: [...fallbackData.employees],
  inventory: [...fallbackData.inventory],
  invoices: [...fallbackData.invoices],
  coupons: [...fallbackData.coupons],
  customers: [...fallbackData.customers],
  customerBookings: [...fallbackData.customerBookings],
  adminBookings: [...fallbackData.adminBookings],
  bookings: [...fallbackData.adminBookings],
};

const otpStore = new Map();

let database = null;

async function connectToMongo() {
  if (database) return database;

  try {
    const client = new MongoClient(mongoUri, {
      serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
      },
    });

    await client.connect();
    database = client.db('detailpro');

    await database.command({ ping: 1 });
    await seedCollections(database);
    console.log(`MongoDB connected: ${mongoUri}`);
  } catch (error) {
    console.warn('MongoDB unavailable, using in-memory fallback data.');
    console.warn(error.message);
  }

  return database;
}

async function seedCollections(databaseConnection) {
  const collections = [
    ['services', fallbackData.services],
    ['membershipPlans', fallbackData.membershipPlans],
    ['reviews', fallbackData.reviews],
    ['galleryItems', fallbackData.galleryItems],
    ['teamMembers', fallbackData.teamMembers],
    ['blogPosts', fallbackData.blogPosts],
    ['employees', fallbackData.employees],
    ['inventory', fallbackData.inventory],
    ['invoices', fallbackData.invoices],
    ['coupons', fallbackData.coupons],
    ['customers', fallbackData.customers],
    ['bookings', []],
  ];

  for (const [name, docs] of collections) {
    const collection = databaseConnection.collection(name);
    const count = await collection.countDocuments();
    if (count === 0) {
      if (docs.length) {
        await collection.insertMany(docs);
      }
    }
  }
}

async function getCollection(name, fallbackDocs) {
  if (database) {
    try {
      const collection = database.collection(name);
      const docs = await collection.find({}).toArray();
      if (docs.length > 0) return docs;
      await collection.insertMany(fallbackDocs);
      return fallbackDocs;
    } catch (error) {
      console.warn(`Could not read ${name} from MongoDB, using fallback.`);
    }
  }

  return memoryStore[name] || fallbackDocs;
}

async function writeCollection(name, docs) {
  memoryStore[name] = docs;
  if (database) {
    try {
      const collection = database.collection(name);
      await collection.deleteMany({});
      if (docs.length > 0) {
        await collection.insertMany(docs);
      }
    } catch (error) {
      console.warn(`Could not persist ${name} to MongoDB.`);
    }
  }
}

function createToken(user) {
  return `jwt.${Buffer.from(user.id).toString('base64')}.${Date.now()}`;
}

function normalizePhone(phone) {
  const value = String(phone || '').trim();
  return value.replace(/\s+/g, '');
}

function generateOtp() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

async function sendWhatsAppOtp(phone, otp) {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const from = process.env.TWILIO_WHATSAPP_FROM;
  const contentSid = process.env.TWILIO_CONTENT_SID || 'HX229f5a04fd0510ce1b071852155d3e75';

  if (!accountSid || !authToken || !from) {
    return { ok: false, fallback: false, otp, reason: 'Twilio credentials are not configured.' };
  }

  try {
    const client = twilio(accountSid, authToken);
    const message = await client.messages.create({
      from,
      contentSid,
      contentVariables: JSON.stringify({ 1: otp }),
      to: `whatsapp:${phone}`,
    });

    return { ok: true, fallback: false, otp, sid: message.sid };
  } catch (error) {
    console.error('Twilio WhatsApp error:', error.message);
    return { ok: false, fallback: false, otp, reason: error.message };
  }
}

app.get('/api/health', async (_req, res) => {
  const connectionState = database ? 'connected' : 'fallback';
  res.json({ status: 'ok', database: connectionState, mongoUri });
});

app.post('/api/auth/login', (req, res) => {
  const { email = '', password = '' } = req.body || {};
  const isAdmin = String(email).includes('admin');
  const user = isAdmin
    ? { id: 'admin-1', name: 'Admin User', email, role: 'admin' }
    : { id: 'user-1', name: 'Customer User', email, role: 'customer' };

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required.' });
  }

  return res.json({ user, token: createToken(user) });
});

app.post('/api/auth/send-otp', async (req, res) => {
  const phone = normalizePhone(req.body?.phone || '');
  if (!phone) {
    return res.status(400).json({ message: 'Phone number is required.' });
  }

  const otp = generateOtp();
  otpStore.set(phone, { otp, expiresAt: Date.now() + 5 * 60 * 1000 });

  const result = await sendWhatsAppOtp(phone, otp);
  if (result.ok && !result.fallback) {
    return res.json({ sent: true, otp, message: 'OTP sent via WhatsApp.' });
  }

  return res.status(200).json({
    sent: false,
    otp,
    message: 'OTP delivery is currently unavailable. Please use the code shown below to continue.',
  });
});

app.post('/api/auth/verify-otp', (req, res) => {
  const phone = normalizePhone(req.body?.phone || '');
  const otp = String(req.body?.otp || '');
  const record = otpStore.get(phone);

  const isValid = Boolean(record && Date.now() <= record.expiresAt && record.otp === otp);

  if (!isValid) {
    return res.status(401).json({ message: 'Invalid or expired OTP.' });
  }

  if (record) {
    otpStore.delete(phone);
  }

  const user = { id: 'user-1', name: 'Customer User', email: 'customer@example.com', role: 'customer' };
  return res.json({ user, token: createToken(user) });
});

app.post('/api/auth/logout', (_req, res) => {
  res.json({ success: true });
});

app.get('/api/services', async (_req, res) => {
  res.json(await getCollection('services', fallbackData.services));
});

app.get('/api/memberships', async (_req, res) => {
  res.json(await getCollection('membershipPlans', fallbackData.membershipPlans));
});

app.get('/api/reviews', async (_req, res) => {
  res.json(await getCollection('reviews', fallbackData.reviews));
});

app.get('/api/gallery', async (_req, res) => {
  res.json(await getCollection('galleryItems', fallbackData.galleryItems));
});

app.get('/api/team', async (_req, res) => {
  res.json(await getCollection('teamMembers', fallbackData.teamMembers));
});

app.get('/api/blogposts', async (_req, res) => {
  res.json(await getCollection('blogPosts', fallbackData.blogPosts));
});

app.get('/api/blogposts/:id', async (req, res) => {
  const posts = await getCollection('blogPosts', fallbackData.blogPosts);
  const post = posts.find((item) => item.id === req.params.id) || null;
  res.json(post);
});

app.post('/api/bookings', async (req, res) => {
  const bookings = await getCollection('bookings', []);
  const booking = {
    ...req.body,
    id: `bk-${Math.random().toString(36).slice(2, 8)}`,
    status: 'pending',
    createdAt: new Date().toISOString().slice(0, 10),
  };

  const nextBookings = [...bookings, booking];
  await writeCollection('bookings', nextBookings);
  memoryStore.adminBookings = nextBookings;
  memoryStore.customerBookings = nextBookings;
  res.json(booking);
});

app.get('/api/bookings/customer/:userId', async (req, res) => {
  const bookings = await getCollection('bookings', []);
  const filtered = bookings.filter((item) => item.userId === req.params.userId || item.customerEmail === req.params.userId);
  res.json(filtered);
});

app.get('/api/bookings/admin', async (_req, res) => {
  const bookings = await getCollection('bookings', []);
  res.json(bookings);
});

app.patch('/api/bookings/:id/status', async (req, res) => {
  const bookings = await getCollection('bookings', []);
  const updated = bookings.map((item) => (item.id === req.params.id ? { ...item, status: req.body.status } : item));
  await writeCollection('bookings', updated);
  res.json(updated.find((item) => item.id === req.params.id) || null);
});

app.patch('/api/bookings/:id/assign', async (req, res) => {
  const bookings = await getCollection('bookings', []);
  const updated = bookings.map((item) => (item.id === req.params.id ? { ...item, assignedEmployee: req.body.employeeName } : item));
  await writeCollection('bookings', updated);
  res.json(updated.find((item) => item.id === req.params.id) || null);
});

app.get('/api/customers', async (_req, res) => {
  res.json(await getCollection('customers', fallbackData.customers));
});

app.get('/api/employees', async (_req, res) => {
  res.json(await getCollection('employees', fallbackData.employees));
});

app.get('/api/inventory', async (_req, res) => {
  res.json(await getCollection('inventory', fallbackData.inventory));
});

app.get('/api/invoices', async (_req, res) => {
  res.json(await getCollection('invoices', fallbackData.invoices));
});

app.get('/api/coupons', async (_req, res) => {
  res.json(await getCollection('coupons', fallbackData.coupons));
});

app.get('/api/dashboard/stats', async (_req, res) => {
  res.json(fallbackData.dashboardStats);
});

app.use(express.static(path.join(__dirname, '..', 'dist')));

app.get('*', (_req, res) => {
  res.sendFile(path.join(__dirname, '..', 'dist', 'index.html'));
});

connectToMongo().then(() => {
  app.listen(port, '0.0.0.0', () => {
    console.log(`Backend running at http://127.0.0.1:${port}`);
  });
});
