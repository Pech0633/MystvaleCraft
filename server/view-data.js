const { connect } = require('./database');
const Promotions = require('./model/promotions');
const User = require('./model/user');

async function viewData() {
  try {
    // เชื่อมต่อฐานข้อมูล
    await connect();
    console.log('✅ เชื่อมต่อฐานข้อมูลสำเร็จ\n');

    // ดึงข้อมูล promotions
    console.log('📊 ข้อมูล Promotions:');
    const promotions = await Promotions.findAll();
    if (promotions.length === 0) {
      console.log('❌ ไม่มีข้อมูล promotions ในฐานข้อมูล');
    } else {
      console.log(`✅ พบข้อมูล promotions ${promotions.length} รายการ:`);
      promotions.forEach((promo, index) => {
        console.log(`${index + 1}. ID: ${promo.id}`);
        console.log(`   Name: ${promo.name}`);
        console.log(`   Image: ${promo.img}`);
        console.log(`   RP Limited: ${promo.rplimited}`);
        console.log(`   Command: ${promo.command}`);
        console.log('');
      });
    }

    // ดึงข้อมูล users
    console.log('👥 ข้อมูล Users:');
    const users = await User.findAll({
      attributes: ['id', 'username', 'realname', 'point', 'rank', 'RP']
    });
    if (users.length === 0) {
      console.log('❌ ไม่มีข้อมูล users ในฐานข้อมูล');
    } else {
      console.log(`✅ พบข้อมูล users ${users.length} รายการ:`);
      users.forEach((user, index) => {
        console.log(`${index + 1}. ID: ${user.id}`);
        console.log(`   Username: ${user.username}`);
        console.log(`   Realname: ${user.realname}`);
        console.log(`   Point: ${user.point}`);
        console.log(`   Rank: ${user.rank}`);
        console.log(`   RP: ${user.RP}`);
        console.log('');
      });
    }

    // แสดงตัวอย่างข้อมูลที่เหมาะสมสำหรับการทดสอบ
    console.log('🔍 ตัวอย่างข้อมูลสำหรับการทดสอบ:');
    if (users.length > 0) {
      const testUser = users[0];
      console.log(`User ID สำหรับทดสอบ: ${testUser.id}`);
      console.log(`Username: ${testUser.username}`);
      console.log(`RP: ${testUser.RP}`);
    }

    if (promotions.length > 0) {
      console.log('\nPromotions ที่มี:');
      promotions.forEach(promo => {
        console.log(`- ID: ${promo.id}, Name: ${promo.name}, RP Required: ${promo.rplimited}`);
      });
    }

  } catch (error) {
    console.error('❌ เกิดข้อผิดพลาด:', error);
  } finally {
    process.exit(0);
  }
}

// รันฟังก์ชัน
viewData(); 