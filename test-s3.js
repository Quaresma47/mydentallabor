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
const API_BASE = "https://o3scypukx3.execute-api.eu-central-1.amazonaws.com/prod";

async function uploadFile(file) {
  // 1️⃣ Lambda'dan presigned URL al
  const res = await fetch(`${API_BASE}/get-presigned`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      fileName: file.name,
      contentType: file.type,
    }),
  });

  const data = await res.json();
  const uploadURL = data.uploadURL;

  if (!uploadURL) {
    alert("Presigned URL alınamadı!");
    return;
  }

  // 2️⃣ Dosyayı presigned URL'ye PUT isteği ile yükle
  await fetch(uploadURL, {
    method: "PUT",
    headers: { "Content-Type": file.type },
    body: file,
  });

  // 3️⃣ Yükleme başarılı → preview sayfasına yönlendir
  window.location.href = `preview.html?file=${encodeURIComponent(file.name)}`;
}

// Örnek kullanım: bir input'tan dosya seçilince yükle
document.querySelector("#fileInput").addEventListener("change", async (e) => {
  const file = e.target.files[0];
  if (file) {
    await uploadFile(file);
  }
});


