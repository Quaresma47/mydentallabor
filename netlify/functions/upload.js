const AWS = require('aws-sdk');
const Busboy = require('busboy');

exports.handler = async (event, context) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION,
  });

  return new Promise((resolve, reject) => {
    const busboy = new Busboy({ headers: event.headers });
    let uploadPromises = [];

    busboy.on('file', (fieldname, file, filename, encoding, mimetype) => {
      const params = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: `uploads/${filename}`,
        Body: file,
        ContentType: mimetype,
      };

      uploadPromises.push(s3.upload(params).promise());
    });

    busboy.on('finish', async () => {
      try {
        await Promise.all(uploadPromises);
        resolve({ statusCode: 200, body: 'Dosya başarıyla yüklendi!' });
      } catch (err) {
        reject({ statusCode: 500, body: 'Yükleme hatası: ' + err.message });
      }
    });

    busboy.end(Buffer.from(event.body, 'base64'));
  });
};

document.getElementById('previewBtn').addEventListener('click', () => {
  const fileInput = document.getElementById('file');
  const file = fileInput.files[0];
  if (file && file.name.endsWith('.stl')) {
    window.location.href = `/preview.html?file=${encodeURIComponent(file.name)}`;
  } else {
    alert('Lütfen STL formatında bir dosya seçin.');
  }
});


	
	
