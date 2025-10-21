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

    // 1️⃣ Yükleme başlıyor bildirimi
    showStatus("📤 Yükleniyor...", "#ffd700");

    // 2️⃣ Presigned URL al (Lambda üzerinden)
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
      showStatus("❌ Presigned URL alınamadı", "red");
      alert("Presigned URL alınamadı!");
      return;
    }

    // 3️⃣ Dosyayı yükle
    await fetch(uploadURL, {
      method: "PUT",
      headers: { "Content-Type": file.type },
      body: file,
    });

    // 4️⃣ Başarılı bildirim
    showStatus("✅ Yüklendi!", "#00ff00");
    setTimeout(() => document.getElementById("uploadStatus")?.remove(), 3000);

    // 5️⃣ Önizleme sayfasına yönlendir
    window.location.href = `preview.html?file=${encodeURIComponent(file.name)}`;

  } catch (err) {
    console.error("❌ Yükleme hatası:", err);
    showStatus("❌ Hata oluştu", "red");
  }
}

// 🎯 Dosya seçildiğinde yükle
document.querySelector("#fileInput").addEventListener("change", async (e) => {
  const file = e.target.files[0];
  if (file) await uploadFile(file);
});



