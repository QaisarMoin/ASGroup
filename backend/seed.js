require('dotenv').config();
const bcrypt = require('bcryptjs');
const connectDB = require('./config/db');
const User = require('./models/User');
const CommissionSetting = require('./models/CommissionSetting');

const seed = async () => {
  await connectDB();

  // Remove existing admin
  await User.deleteOne({ email: 'admin@asgroup.com' });

  const hashedPassword = await bcrypt.hash('Admin@123', 12);

  const admin = await User.create({
    fullName: 'AS Group Admin',
    email: 'admin@asgroup.com',
    phone: '9999999999',
    password: hashedPassword,
    role: 'admin',
    isActive: true,
    referralCode: 'ADMIN001',
  });

  console.log('✅ Admin seeded:', admin.email);

  // Seed default commission settings
  await CommissionSetting.deleteMany({});
  await CommissionSetting.create({
    joiningCommission: 0,
    levelWiseCommission: {
      '1': 20,
      '2': 10,
      '3': 5,
      '4': 3,
      '5': 2,
    },
    isActive: true,
  });

  console.log('✅ Commission settings seeded');
  console.log('✅ Seed complete! Admin: admin@asgroup.com | Password: Admin@123');
  process.exit(0);
};

seed().catch((err) => {
  console.error('❌ Seed error:', err);
  process.exit(1);
});
