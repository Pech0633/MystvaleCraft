const axios = require('axios');

const BASE_URL = 'http://localhost:3001';

// ฟังก์ชันทดสอบการตรวจสอบ promotions
async function testCheckPromotions() {
  try {
    console.log('🔍 ทดสอบการตรวจสอบ promotions...');
    
    const response = await axios.post(`${BASE_URL}/check-promotions`, {
      userId: 1 // เปลี่ยนเป็น userId ที่มีอยู่จริง
    });

    console.log('✅ ผลลัพธ์การตรวจสอบ promotions:');
    console.log('Status:', response.data.status);
    console.log('User RP:', response.data.userRP);
    console.log('Promotions ที่รับได้:', response.data.availablePromotions.length);
    console.log('Promotions ที่รับไปแล้ว:', response.data.claimedPromotions.length);
    
    if (response.data.availablePromotions.length > 0) {
      console.log('\n📋 Promotions ที่รับได้:');
      response.data.availablePromotions.forEach(promo => {
        console.log(`- ${promo.name} (ต้องการ RP: ${promo.rplimited})`);
      });
    }

    if (response.data.claimedPromotions.length > 0) {
      console.log('\n✅ Promotions ที่รับไปแล้ว:');
      response.data.claimedPromotions.forEach(promo => {
        console.log(`- ${promo.name} (ต้องการ RP: ${promo.rplimited})`);
      });
    }

  } catch (error) {
    console.error('❌ เกิดข้อผิดพลาด:', error.response?.data || error.message);
  }
}

// ฟังก์ชันทดสอบการรับรางวัล promotion
async function testClaimPromotion() {
  try {
    console.log('\n🎁 ทดสอบการรับรางวัล promotion...');
    
    const response = await axios.post(`${BASE_URL}/claim-promotion`, {
      userId: 1, // เปลี่ยนเป็น userId ที่มีอยู่จริง
      promotionId: 1 // เปลี่ยนเป็น promotionId ที่มีอยู่จริง
    });

    console.log('✅ ผลลัพธ์การรับรางวัล:');
    console.log('Status:', response.data.status);
    console.log('Message:', response.data.message);
    console.log('Promotion:', response.data.promotion);

  } catch (error) {
    console.error('❌ เกิดข้อผิดพลาด:', error.response?.data || error.message);
  }
}

// ฟังก์ชันแสดงข้อมูล promotions ทั้งหมด
async function testGetAllPromotions() {
  try {
    console.log('\n📊 ทดสอบการดึงข้อมูล promotions ทั้งหมด...');
    
    const response = await axios.get(`${BASE_URL}/promotions`);
    console.log('✅ ข้อมูล promotions ทั้งหมด:');
    console.log(JSON.stringify(response.data, null, 2));

  } catch (error) {
    console.error('❌ เกิดข้อผิดพลาด:', error.response?.data || error.message);
  }
}

// รันการทดสอบ
async function runTests() {
  console.log('🚀 เริ่มการทดสอบ API Promotions...\n');
  
  await testGetAllPromotions();
  await testCheckPromotions();
  await testClaimPromotion();
  
  console.log('\n✨ การทดสอบเสร็จสิ้น');
}

// รันการทดสอบถ้าเรียกไฟล์นี้โดยตรง
if (require.main === module) {
  runTests();
}

module.exports = {
  testCheckPromotions,
  testClaimPromotion,
  testGetAllPromotions
}; 