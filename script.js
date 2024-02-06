
const apiKey = `UxHMKyOVfjLunJgC6Zh35uJPfpY7Zf79`; //OT7OEDUQ2pjazwDcpjtYm1vsfvVdO7KoT2gZvPSW
// Get elements from the DOM
const searchInput = document.getElementById("search-input");
const dropdownButton = document.getElementById("dropdown-button");
const dropdownList = document.getElementById("dropdown-list");
const submitInput = document.getElementById("holidaysubmit");
let items = [];

// Function to toggle the dropdown list visibility
function toggleDropdown() {
  dropdownList.style.display =
    dropdownList.style.display === "block" ? "none" : "block";
}

// Function to filter items based on the search input
function filterItems() {
  const searchTerm = searchInput.value.toLowerCase();
  items.forEach((item) => {
    const text = item.textContent.toLowerCase();
    if (text.includes(searchTerm)) {
      item.style.display = "block";
    } else {
      item.style.display = "none";
    }
  });
}

// Attach event listeners
searchInput.addEventListener("input", filterItems);
dropdownButton.addEventListener("click", toggleDropdown);
submitInput.addEventListener("click", getHolidayDetails);
dropdownList.addEventListener("click", (e) => {
  if (e.target.tagName === "LI") {
    dropdownButton.textContent = e.target.textContent;
    dropdownButton.setAttribute("value", e.target.getAttribute("value"));
    toggleDropdown();
  }
});

// Close the dropdown when clicking outside
document.addEventListener("click", (e) => {
  if (e.target !== searchInput && e.target !== dropdownButton) {
    dropdownList.style.display = "none";
  }
});

function fetchApidata(url, isloadCountries) {
  let promise = new Promise((resolve, reject) => {
    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        if (isloadCountries) {
          console.log(data.response.countries);
          addCountriesOption(data.response.countries);
        } else {
          displayData(data.response);
        }
        resolve(data); // Resolve the promise with the fetched data
      })
      .catch((error) => {
        reject(error);
      });
  });

  return promise; 
}


fetchApidata(
  `https://calendarific.com/api/v2/countries?api_key=${apiKey}`,
  true
);

function addCountriesOption(countries) {
  countries.forEach((item) => {
    let ul = document.getElementById("dropdown-list");
    let list = document.createElement("li");
    list.setAttribute("value", item["iso-3166"]);
    list.innerHTML = item.country_name;
    ul.append(list);
  });
  items = Array.from(dropdownList.getElementsByTagName("li"));
}

function getHolidayDetails() {
  const country = dropdownButton.getAttribute("value");
  const dt = document.getElementById("date");
  const dateInput = new Date(dt.value);
  const day = dateInput.getDate();
  const month = dateInput.getMonth() + 1;
  const year = dateInput.getFullYear();
  const type = "national";
  console.log(
    `type : ${type} / date : ${day} / month : ${month} / year : ${year}`
  );
  fetchApidata(
    `https://calendarific.com/api/v2/holidays?&api_key=${apiKey}&country=${country}&type=${type}&year=${year}&month=${month}&day=${day}`,
    false
  );
}

function displayData(data) {
  // Check if "holidays" property exists in the data
  if (data.holidays && data.holidays.length > 0) {
    // If there are holidays, display them in a table
    let tableCols = document.getElementById("tableCol");

    // Clear any existing rows
    tableCols.innerHTML = "";

    for (let holiday of data.holidays) {
      let row = document.createElement("tr");

      let nameData = document.createElement("td");
      nameData.textContent = holiday.name;
      row.appendChild(nameData);

      let desData = document.createElement("td");
      desData.textContent = holiday.description;
      row.appendChild(desData);

      tableCols.appendChild(row);
    }
    let nodata = document.getElementById("noHoliday");
    if (nodata.style.visibility == "visible") {
      nodata.style.visibility = "hidden";
    }
    tableBody = document.getElementById("tableBody");
    tableBody.style.visibility = "visible";
  } else {
    // If there are no holidays, display a message
    let nodata = document.getElementById("noHoliday");
    nodata.innerHTML = "<h5>No National Holiday on the given date!</h5>";
    tableBody = document.getElementById("tableBody");
    if (tableBody.style.visibility == "visible") {
      tableBody.style.visibility = "hidden";
    }
    nodata.style.visibility = "visible";
  }
}