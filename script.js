const brandFilter = document.getElementById('brandFilter');
const typeFilter = document.getElementById('typeFilter');
const carList = document.getElementById('carList');
const loading = document.getElementById('loading');

let carsData = [];

async function loadCars() {
  loading.style.display = 'block';
  try {
    const res = await fetch('https://raw.githubusercontent.com/username/car-catalog/main/cars.json');
    carsData = await res.json();
    populateFilters();
    displayCars();
  } catch(e) {
    carList.innerHTML = '<p style="text-align:center;">Ошибка загрузки базы</p>';
    console.error(e);
  }
}

function populateFilters() {
  const brands = [...new Set(carsData.map(c => c.brand))];
  brands.forEach(b => {
    const option = document.createElement('option');
    option.value = b;
    option.textContent = b;
    brandFilter.appendChild(option);
  });
}

function displayCars() {
  loading.style.display = 'none';
  carList.innerHTML = '';
  const selectedBrand = brandFilter.value;
  const selectedType = typeFilter.value;

  const filtered = carsData.filter(c => 
    (selectedBrand === 'all' || c.brand === selectedBrand) &&
    (selectedType === 'all' || c.type === selectedType)
  );

  if (filtered.length === 0) {
    carList.innerHTML = '<p style="text-align:center;">Автомобили не найдены</p>';
    return;
  }

  filtered.forEach(c => {
    const div = document.createElement('div');
    div.className = 'car';
    div.innerHTML = `
      <img src="${c.img}" alt="${c.brand} ${c.model}">
      <h3>${c.brand} ${c.model}</h3>
      <p>Год: ${c.year}</p>
      <p>Тип: ${c.type}</p>
    `;
    carList.appendChild(div);
  });
}

brandFilter.addEventListener('change', displayCars);
typeFilter.addEventListener('change', displayCars);

loadCars();

