const form = document.getElementById('carForm');

const GITHUB_USER = 'username';        // ваш GitHub
const REPO = 'car-catalog';            // репозиторий
const FILE_PATH = 'cars.json';         // файл базы
const TOKEN = 'ghp_ВАШ_ТОКЕН_СЮДА';   // Personal Access Token

async function getFileSha() {
  const res = await fetch(`https://api.github.com/repos/${GITHUB_USER}/${REPO}/contents/${FILE_PATH}`);
  const data = await res.json();
  return data.sha;
}

async function updateGitHubFile(contentBase64) {
  const sha = await getFileSha();
  await fetch(`https://api.github.com/repos/${GITHUB_USER}/${REPO}/contents/${FILE_PATH}`, {
    method: 'PUT',
    headers: {
      'Authorization': `token ${TOKEN}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      message: 'Добавлен новый автомобиль',
      content: contentBase64,
      sha: sha
    })
  });
}

form.addEventListener('submit', async e => {
  e.preventDefault();
  const newCar = {
    brand: document.getElementById('brand').value,
    model: document.getElementById('model').value,
    year: Number(document.getElementById('year').value),
    type: document.getElementById('type').value,
    img: document.getElementById('img').value
  };

  const res = await fetch(`https://raw.githubusercontent.com/${GITHUB_USER}/${REPO}/main/${FILE_PATH}`);
  const cars = await res.json();
  cars.push(newCar);

  const contentBase64 = btoa(JSON.stringify(cars, null, 2));

  try {
    await updateGitHubFile(contentBase64);
    alert('Автомобиль успешно добавлен на GitHub!');
    form.reset();
  } catch(err) {
    console.error(err);
    alert('Ошибка при добавлении автомобиля!');
  }
});

