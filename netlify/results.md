# Netlify Dosya Gönderim ve Viewer Özeti

## Form Özellikleri
- Kullanıcılar `.stl` formatında birden fazla dosya yükleyebiliyor.
- Form Netlify Forms ile uyumlu (`data-netlify`, `form-name`, `enctype`).
- Ad soyad ve açıklama alanları mevcut.
- Honeypot alanı ile spam koruması sağlandı.
- Gönderim sırasında “loading...” animasyonu gösteriliyor.
- Gönderim sonrası teşekkür mesajı sunuluyor.

## Viewer Özellikleri
- Yüklenen `.stl` dosyaları kullanıcıya özel gruplanıyor.
- `preview.html` sayfasında Three.js ile 3D görüntüleme sağlandı.
- Viewer, STLLoader ile dosyaları gerçek zamanlı render ediyor.
- Dosya yolu dinamik olarak belirlenebiliyor.

## Teknik Notlar
- Büyük dosyalar için Git LFS önerildi.
- Türkçe karakterli dosya adlarından kaçınıldı.
- Tüm yapı Netlify üzerinden otomatik deploy ediliyor.