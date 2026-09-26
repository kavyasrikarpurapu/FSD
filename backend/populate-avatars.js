require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./src/models/User');

const curatedAvatars = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=350&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=350&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=350&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=350&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=350&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=350&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=350&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=350&auto=format&fit=crop&q=80'
];

async function updateMissingAvatars() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB Atlas...');

    const users = await User.find({});
    console.log(`Found ${users.length} total users.`);

    let updatedCount = 0;
    for (let i = 0; i < users.length; i++) {
      const user = users[i];
      if (!user.avatar || user.avatar.includes('dicebear') || user.avatar.trim() === '') {
        const chosenAvatar = curatedAvatars[i % curatedAvatars.length];
        user.avatar = chosenAvatar;
        await user.save();
        console.log(`✅ Updated avatar for user: ${user.name} (${user.email}) -> ${user.avatar}`);
        updatedCount++;
      }
    }

    console.log(`\n🎉 Done! Updated ${updatedCount} users with realistic profile pictures.`);
    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('Error updating avatars:', error);
    process.exit(1);
  }
}

updateMissingAvatars();
