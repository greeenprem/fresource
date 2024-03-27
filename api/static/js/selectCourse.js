import { getCourseURL, coursesURL, clientLoginURL } from "../utils/env.js";
import { tost } from "./Toastify.js";



let globCourse;
async function fetchBranches(clgname) {
  try {
      const response = await fetch('/static/json/branches.json');
      const data = await response.json();

      // Find the "DTU" college object
      const dtuCollege = data.collegesWithBranches.find(college => college.name === clgname);

      // Extract branch names from the "DTU" college branches
      const dtuBranchNames = dtuCollege.branches.map(branch => branch.name);
      const dtuBranchIds = dtuCollege.branches.map(branch => branch.id);

      console.log(dtuBranchNames);
      return [dtuBranchNames,dtuBranchIds];
  } catch (error) {
      console.error('Error fetching branches:', error);
      return [];
  }
}

function openInNewTab(url) {
  window.open(url, '_blank');
}

async function populateBranchOptions(college) {
  try {
      const data = await fetchBranches(college); // Assuming fetchBranches is a function that returns the array of branch names
      const branchNames = data[0]
      const branchIds = data[1]

      const selectElement = document.getElementById('branch');

      // Clear existing options
      selectElement.innerHTML = '';

      // Add the "None" option
      const noneOption = document.createElement('option');
      noneOption.value = '1';
      noneOption.textContent = 'None';
      selectElement.appendChild(noneOption);

      // Add branch options
      branchNames.forEach((branchName, index) => {
          const option = document.createElement('option');
          option.value = branchIds[index]; // Start from 2
          option.textContent = branchName;
          selectElement.appendChild(option);
      });
  } catch (error) {
      console.error('Error populating branch options:', error);
  }
}
populateBranchOptions("DTU");
var selectInput = document.getElementById('sticked');
selectInput.addEventListener('change', function() {
    populateBranchOptions(selectInput.value);
});

var coursesDatas={};

async function fetchBranchData(branchId) {
  const url = `/api?query=`+encodeURIComponent(`https://fresources.tech/api/trpc/user.getUserBranchAndCourseWithSemester?batch=1&input=%7B%220%22%3A%7B%22json%22%3A%7B%22branchId%22%3A%22${branchId}%22%7D%7D%2C%221%22%3A%7B%22json%22%3A%7B%22branchId%22%3A%22${branchId}%22%7D%7D%2C%222%22%3A%7B%22json%22%3A%7B%22courseId%22%3A%2263066b899cbab109372b8285%22%7D%7D%7D`);
  console.log(url)
  try {
      const response = await fetch(url);
      if (!response.ok) {
          throw new Error('Failed to fetch data');
      }
      const data1 = await response.json()
      var data=data1[0].result.data.json
      const courses = {0:[],1:[],2:[],3:[],4:[],5:[],6:[],7:[],8:[],};

      data.forEach((i)=>{courses[i.semester].push(i.course.name)})
      data.forEach((i)=>{coursesDatas[i.course.name]=[i.course.id,i.course.syllabusURI]})


      return courses;
  } catch (error) {
      console.error('Error fetching data:', error);
      return null;
  }
}

function removeLoaderAnimation() {
  var loaderText = document.querySelector('.loader');
  loaderText.className = 'fd'
  // Change text of .loader span
  loaderText.textContent = 'Select a Branch';
}
removeLoaderAnimation()
const selectElement = document.getElementById('branch');








const courses = {
  1: ["Math 1", "Physics", "Technical Foundation", "CS1"],
  2: [
    "Math2 ",
    "OOP",
    "Network",
    "Micro Computer",
    "Theoretical",
    "Pro tips ✨2",
  ],
  3: ["CPP", "OS", "DSA", "DB", "Math 3"],
  4: ["SE", "DS", "IT", "Distributed", "Media", "Math 4", "Pro tips ✨4"],
};

const courseImages = [
  "../static/images/courses (1).svg",
  "../static/images/courses (2).svg",
  "../static/images/courses (3).svg",
  "../static/images/courses (4).svg",
  "../static/images/courses (1).svg",
  "../static/images/courses (2).svg",
  "../static/images/courses (3).svg",
  "../static/images/courses (4).svg",
];

const semesterSelect = document.getElementById("semester");
const courseList = document.getElementById("course-list");

const pageData = document.getElementById("yaya");
//pageData.style.display = "none";

const loader = document.getElementById("loader");
loader.style.display = "flex";

function displayCourses(courses) {
  console.log("called")
  const selectedSemester = semesterSelect.value;
  const selectedCourses = courses[selectedSemester];
  courseList.innerHTML = "";
  if (selectedCourses.length==0){console.log("yoyoy");courseList.textContent = "No courses available for this semester.";}
  if (selectedCourses) {
    selectedCourses.forEach((course, index) => {
      //create course card
      loader.style.display = "none";
      pageData.style.display = "grid";
      const courseCard = document.createElement("div");
      courseCard.className = "course-card";
      courseCard.id = coursesDatas[course][0]

      //create course paragraph
      const courseName = document.createElement("p");

      courseName.textContent = course;
      courseCard.appendChild(courseName);
      console.log("hello")
      console.log(course);
      //add card images
      const cardImg = document.createElement("img");
      if (course.slice(0, -1) === "Pro tips ✨") {
        cardImg.src = "../images/pro_tips.svg";
        courseName.textContent = course.slice(0, -1);
      } else cardImg.src = courseImages[index % courseImages.length];
      courseCard.appendChild(cardImg);

      courseCard.addEventListener("click", async function () {
        localStorage.setItem("selectedBranch",document.getElementById('branch').options[document.getElementById('branch').selectedIndex].textContent)
        localStorage.setItem("selectedSub",course)
        localStorage.setItem("currentSub",selectedCourses)
        window.location.replace("/viewCourse?courseId="+coursesDatas[course][0]), history.pushState(null, null, "/");
      });
      courseList.appendChild(courseCard);
    });
  } else if (selectedCourses.length==0) {
    courseList.textContent = "No courses available for this semester.";
  }
}

semesterSelect.addEventListener("change", async function(){

  displayCourses(globCourse)
});
//displayCourses();

//remove admin button
const addCourseButton = document.querySelector(".re-direct");
addCourseButton.style.display = "none";

selectElement.addEventListener('change', async function() {
  const selectedOption = selectElement.options[selectElement.selectedIndex];
  var cid = selectedOption.value;
  console.log(cid)
  var courses = await fetchBranchData(cid)
  globCourse = courses
  console.log(courses)
  displayCourses(courses)
  console.log(coursesDatas)

});

