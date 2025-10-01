const fs = require('fs');
const path = require('path');

const directories = [
  'src',
  'src/config',
  'src/controllers',
  'src/middlewares',
  'src/models',
  'src/routes',
  'src/services',
  'src/utils',
  'src/validators',
  'src/constants',
  'src/types',
  'src/interfaces',
  'src/database',
  'src/database/migrations',
  'src/database/seeds',
  'src/tests',
  'src/tests/unit',
  'src/tests/integration',
  'src/tests/e2e',
  'logs',
  'docs'
];

// Create directories
directories.forEach(dir => {
  const dirPath = path.join(__dirname, dir);
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    console.log(`Created directory: ${dir}`);
  }
});

// Create .env file
const envContent = `PORT=3000
MONGODB_URI=mongodb://localhost:27017/hotel-service
JWT_SECRET=your_jwt_secret_key
NODE_ENV=development
`;

if (!fs.existsSync('.env')) {
  fs.writeFileSync('.env', envContent);
  console.log('Created .env file');
}

// Create .gitignore
const gitignoreContent = `node_modules
.env
logs
*.log
.DS_Store
coverage
dist
build
`;

if (!fs.existsSync('.gitignore')) {
  fs.writeFileSync('.gitignore', gitignoreContent);
  console.log('Created .gitignore file');
}

console.log('Project structure setup completed!'); 