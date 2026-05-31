const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinary');

// Armazena os PDFs no Cloudinary.
// PDF é tratado como resource_type "image" (padrão do Cloudinary), o que
// permite a entrega inline com o content-type correto para abrir no navegador.
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'observatorio-pi',
    resource_type: 'image',
    format: 'pdf',
    public_id: (req, file) => {
      const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
      const base = file.originalname.replace(/\.[^.]+$/, '').replace(/[^a-zA-Z0-9_-]/g, '_');
      return `${unique}-${base}`;
    },
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'application/pdf') {
    cb(null, true);
  } else {
    cb(new Error('Apenas arquivos PDF são aceitos'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: parseInt(process.env.MAX_FILE_SIZE) || 10485760 },
});

module.exports = upload;