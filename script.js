const contentDiv = document.getElementById("content");
const prevButton = document.getElementById("prev");
const nextButton = document.getElementById("next");
const searchInput = document.getElementById("search");
const searchButton = document.getElementById("searchButton");

let currentPage = 1;
let jobsPerPage = 10;
let totalPages = 0;
let jobsData = [];

let searchQuery = "";

//Date and Name
const moduleName = "Module 1 Technical Interview";
const learnerName = "Khoa Nguyen";
const today = new Date();
const formattedDate = `${
  today.getMonth() + 1
}/${today.getDate()}/${today.getFullYear()}`;

//Fetch Data
const getJobs = async (page, limit, query) => {
  try {
    const url = `http://localhost:8080/jobs?_page=${page}&_limit=${limit}&q=${
      query || ""
    }`;
    const response = await fetch(url);
    const data = await response.json();
    totalPages = Math.ceil(data.total / limit);
    return data;
  } catch (error) {
    console.log("Error fetching jobs:" + error.message);
  }
};
//Render Jobs
const renderJobs = (jobs, showInitialData = true) => {
  contentDiv.innerHTML = "";

  if (showInitialData) {
    // Add module name, learner name, and date
    const moduleText = document.createElement("h2");
    moduleText.textContent = moduleName;
    contentDiv.appendChild(moduleText);

    const nameText = document.createElement("h3");
    nameText.textContent = `Learner's name: ${learnerName}`;
    contentDiv.appendChild(nameText);

    const dateText = document.createElement("h4");
    dateText.textContent = `Date: ${formattedDate}`;
    contentDiv.appendChild(dateText);
  }

  if (Array.isArray(jobs)) {
    jobs.forEach((job) => {
      const jobTitle = document.createElement("li");
      jobTitle.textContent = `${job.title} --- Workplace: ${
        job.city
      } ==>>  Salary Range: ${job.salaryLow.toLocaleString()}$ - ${job.salaryHigh.toLocaleString()}$`;
      contentDiv.appendChild(jobTitle);
    });
  } else {
    console.error("Error: Invalid jobs data");
  }
};

// Function to handle pagination
const paginate = (direction) => {
  currentPage += direction;
  if (currentPage < 1) currentPage = 1;
  if (currentPage > totalPages) currentPage = totalPages;
  handleSearchOrPagination(searchQuery, currentPage, jobsPerPage);
};

// Function to handle search
const handleSearchOrPagination = async (query, page, limit) => {
  const data = await getJobs(page, limit, query);
  totalPages = Math.ceil(data.total / limit);
  //store search for Next and Prev
  searchQuery = query;
  renderJobs(data);
};

// Initial load
getJobs(currentPage, jobsPerPage).then((jobs) => {
  jobsData = jobs;
  renderJobs(jobs);
});

// Event listeners
prevButton.addEventListener("click", () => paginate(-1));
nextButton.addEventListener("click", () => paginate(1));

searchButton.addEventListener("click", () => {
  handleSearchOrPagination(searchInput.value, 1, jobsPerPage);
});

//Press Enter instead of Click search
searchInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    handleSearchOrPagination(searchInput.value, 1, jobsPerPage);
  }
});
