require('dotenv').config();
const mongoose = require('mongoose');
const WalletTransaction = require('./models/WalletTransaction');

async function test() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to DB');

    const testData = [
      { type: 'credit', transactionType: 'deposit', amount: 100 },
      { type: 'debit', transactionType: 'investment', amount: 50 },
      { type: 'credit', transactionType: 'joining_deposit', amount: 1000 }
    ];

    for (const data of testData) {
      const tx = new WalletTransaction({
        userId: new mongoose.Types.ObjectId(), // dummy
        ...data
      });
      await tx.validate();
      console.log(`✅ Validation passed for: ${data.transactionType}`);
    }

    process.exit(0);
  } catch (error) {
    console.error('❌ Validation failed:', error.message);
    process.exit(1);
  }
}

test();
