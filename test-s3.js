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

// 🔧 Yükleme durumu etiketi oluşturucu
function showStatus(message, color = "#0f0") {
  let statusEl = document.getElementById("uploadStatus");
  if (!statusEl) {
    statusEl = document.createElement("div");
    statusEl.id = "uploadStatus";
    statusEl.style.position = "fixed";
    statusEl.style.bottom = "20px";
    statusEl.style.right = "20px";
    statusEl.style.background = "#111";
    statusEl.style.color = color;
    statusEl.style.padding = "10px 16px";
    statusEl.style.borderRadius = "8px";
    statusEl.style.zIndex = "9999";
    document.body.appendChild(statusEl);
  }
  statusEl.textContent = message;
}

async function uploadFile(file) {
  try {
    const email = document.getElementById("email")?.value?.trim() || "anonymous";

    // 🔹 1️⃣ Yükleme başlıyor bildirimi
    showStatus("📤 Yükleniyor...", "#ffd700");

    // 2️⃣ Lambda'dan presigned URL al (email ile klasör yapısı)
    const res = await fetch(`${API_BASE}/get-presigned`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fileName: `uploads/${email}/${file.name}`,
        contentType: file.type,
      }),
    });

    const data = await res.json();
    const uploadURL = data.uploadURL;

    if (!uploadURL) {
      alert("Presigned URL alınamadı!");
      showStatus("❌ URL alınamadı", "red");
      return;
    }

    // 🔹 3️⃣ Dosyayı yükle
    await fetch(uploadURL, {
      method: "PUT",
      headers: { "Content-Type": file.type },
      body: file,
    });

    // 🔹 4️⃣ Yükleme tamamlandı bildirimi
    showStatus("✅ Yüklendi!", "#00ff00");

    // 3 saniye sonra mesajı kaldır
    setTimeout(() => {
      document.getElementById("uploadStatus")?.remove();
    }, 3000);

    // 🔹 5️⃣ Yükleme tamam → önizleme sayfasına yönlendir
    window.location.href = `preview.html?file=${encodeURIComponent(file.name)}`;

  } catch (err) {
    console.error("❌ Yükleme hatası:", err);
    showStatus("❌ Hata oluştu", "red");
  }
}

// 🎯 Dosya seçildiğinde yükle
document.querySelector("#fileInput").addEventListener("change", async (e) => {
  const file = e.target.files[0];
  if (file) {
    await uploadFile(file);
  }
});


