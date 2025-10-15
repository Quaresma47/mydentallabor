import 'dotenv/config';
import AWS from 'aws-sdk';
import fs from 'fs';

// .env dosyasındaki değişkenleri yükle
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

// Test için küçük bir dosya oluştur
const fileContent = Buffer.from('Deneme dosyası - mydentallabor', 'utf8');
const fileName = 'test-deneme.txt';

// Yükleme parametreleri
const params = {
  Bucket: process.env.AWS_S3_BUCKET,
  Key: fileName,
  Body: fileContent,
};

// Dosyayı yükle
s3.upload(params, (err, data) => {
  if (err) {
    console.error('❌ Yükleme hatası:', err);
  } else {
    console.log('✅ Dosya başarıyla yüklendi!');
    console.log('📁 S3 URL:', data.Location);
  }
});


