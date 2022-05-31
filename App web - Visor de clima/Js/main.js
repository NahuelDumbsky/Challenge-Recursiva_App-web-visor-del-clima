//instanciación e implementación de datos y metodos
const appId = "9a7dc1128241bd01f3ad5809591f97a1";
const wrapper = document.querySelector(".wrapper"),
inputPart = wrapper.querySelector(".inputPart"),
infoTxt = inputPart.querySelector(".infoTxt"),
inputField = inputPart.querySelector("input");
(searchButton = inputPart.querySelector(".searchButton")),
(locationButton = inputPart.querySelector(".locationButton")),
(weatherPart = wrapper.querySelector(".weatherPart")),
(weatherImg = document.querySelector(".weatherPart img")),
(backArrow = wrapper.querySelector("header i"));

//implementación js para que al presionar la tecla "enter" se ejecute la búsqueda
inputField.addEventListener("keyup", e => {
  if (e.key == "Enter" && inputField.value != "") {
    requestApi(inputField.value);
  }
});

//implementación js para el botón de búsqueda
searchButton.addEventListener("click", () => {
  requestApi(inputField.value);
});



//implementación js para el botón de geolocalización
locationButton.addEventListener("click", () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(onSuccess, onError);
  } else { //en caso de que el navegador no soporte la geolocalización
    infoTxt.innerText = "La geolocalización no está disponible en este navegador";
  }
});

//implementación de la api de búsqueda por ciudad/país
function requestApi(city) {
  api = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${appId}`;
  fetchData();
}

//en caso de que el metodo getCurrentPosition devuelva onSuccess se llama a la api de búsqueda por coordenadas
function onSuccess(position) {
  const { latitude, longitude } = position.coords;
  api = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${appId}`;
  fetchData();
}

//en caso de que el metodo getCurrentPosition devuelva onError se muestra un mensaje de error
function onError(error) {
  infoTxt.innerText = error.message;
  infoTxt.classList.add("error");
}

//funcion para obtener los datos de la api
function fetchData() {
  infoTxt.innerText = "Obteniendo datos del clima...";
  infoTxt.classList.add("buscando");
  fetch(api).then((res) => res.json()).then((result) => weatherDetails(result)).catch(() => {
      infoTxt.innerText = "Algo salió mal";
      infoTxt.classList.replace("buscando", "error");
    });
}

//funcion para imprimir los datos en el html
function weatherDetails(info) {
  infoTxt.classList.replace("buscando", "error");
  if (info.cod == "404") {
    infoTxt.innerText = `${inputField.value} no encontrado`;
  } else { //obtencion del valor de las propiedades del json
    const city = info.name;
    const country = info.sys.country;
    const { description, id } = info.weather[0];
    const { temp, feels_like, pressure, humidity, temp_min } = info.main;
    const visibility = info.visibility;
    const wind = info.wind.speed;

    if (id == 800) {
      weatherImg.src = "/img/clear.png";
    } else if (id >= 200 && id <= 232) {
      weatherImg.src = "/img/storm.png";
    } else if (id >= 600 && id <= 622) {
      weatherImg.src = "/img/snow.png";
    } else if (id >= 701 && id <= 781) {
      weatherImg.src = "/img/mist.png";
    } else if (id >= 801 && id <= 804) {
      weatherImg.src = "/img/cloud.png";
    } else if ((id >= 500 && id <= 531) || (id >= 300 && id <= 321)) {
      weatherImg.src = "/img/rain.png";
    }

    //transformación de los valores de las propiedades del json en valores de elementos html
    wrapper.querySelector(".location span").innerText = `${city}, ${country}`;
    wrapper.querySelector(".weatherDetail").innerText = description;
    wrapper.querySelector(".temperature .num").innerText = temp;
    wrapper.querySelector(".feelsLike .num").innerText = feels_like;
    wrapper.querySelector(".atmosphericPressure .mbar").innerText = pressure;
    wrapper.querySelector(".wind .num").innerText = wind;
    wrapper.querySelector(".humidity .num").innerText = humidity;
    wrapper.querySelector(".visibility .num").innerText = visibility;
    wrapper.querySelector(".minTemp .num").innerText = temp_min;

    
    infoTxt.classList.remove("buscando", "error");
    wrapper.classList.add("active"); //control de la visibilidad de los elementos del html
  }
}

//funcionalidad para volver al home
backArrow.addEventListener("click", () => {
  wrapper.classList.remove("active"); //control de la visibilidad de los elementos del html
});