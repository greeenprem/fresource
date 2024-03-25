import { getCourseURL, coursesURL, clientLoginURL } from "../utils/env.js";
import { tost } from "./Toastify.js";

let heading = document.getElementById('subjectHead');
heading.textContent = localStorage.getItem("selectedSub") + '-' + localStorage.getItem("selectedBranch")

async function fetchCourseData(courseId) {
  var out =[]
  var anout ={1:[],2:[],3:[],4:[],5:[],6:[],7:[]}
  const url = `/api?query=`+encodeURIComponent(`https://fresources.tech/api/trpc/example.getBranchNamesByCollegeId,example.getResourcesByCourseId,example.getCourseByBranchId?batch=1&input=%7B%220%22%3A%7B%22json%22%3A%7B%22collegeId%22%3A%22null%22%7D%7D%2C%221%22%3A%7B%22json%22%3A%7B%22courseId%22%3A%22${courseId}%22%7D%7D%2C%222%22%3A%7B%22json%22%3A%7B%22branchId%22%3A%22null%22%7D%7D%7D`);
  console.log(url)
  try {
      const response = await fetch(url);
      if (!response.ok) {
          throw new Error('Failed to fetch data');
      }
      const data1 = await response.json()
      console.log(data1)
      var data=data1[1].result.data.json
      data.forEach((i)=>{out.push([i.resource.name,i.resource.url,i.resource.updatedAt,i.resource.type])})
      out.forEach((i)=>{

        switch (i[3]) {

          case "Note":
            anout[3].push([i[0],i[1]]);
            break;
          case "Paper":
            anout[5].push([i[0],i[1]]);
            break;
          case "Book":
            anout[1].push([i[0],i[1]]);
            break;
          case "Assignment":
            anout[2].push([i[0],i[1]]);
            break;
          case "Playlist":
            anout[6].push([i[0],i[1]]);
            break;
          case "Laboratory":
            anout[7].push([i[0],i[1]]);
            break;
          case "Project":
            anout[4].push([i[0],i[1]]);
            break;

        }

      })
      console.log(anout)
      return anout;
  } catch (error) {
      console.error('Error fetching data:', error);
      return null;
  }
}

function openInNewTab(url) {
  window.open(url, '_blank');
}

const urlParams = new URLSearchParams(window.location.search);
const courseId = urlParams.get('courseId');
if (courseId) {
  var eduData = await fetchCourseData(courseId)
  console.log(eduData);
} else {
  console.log('Course ID not found in URL');
}

//convert the object to course like object






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
  "../images/courses (1).svg",
  "../images/courses (2).svg",
  "../images/courses (3).svg",
  "../images/courses (4).svg",
];

const semesterSelect = document.getElementById("semester");
const courseList = document.getElementById("course-list");

const pageData = document.getElementById("yaya");
pageData.style.display = "none";

const loader = document.getElementById("loader");
loader.style.display = "flex";

function displayCourses(courses,id) {
  console.log("called")
  const selectedSemester = id
  console.log(selectedSemester)
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
      //courseCard.id = coursesDatas[course][0]

      //create course paragraph
      const courseName = document.createElement("p");

      courseName.textContent = course[0];
      courseCard.appendChild(courseName);
      console.log("hello")
      console.log(course);
      //add card images
      //const cardImg = document.createElement("img");
      //if (course.slice(0, -1) === "Pro tips ✨") {
        //cardImg.src = "../images/pro_tips.svg";
        //courseName.textContent = course.slice(0, -1);
      //} else cardImg.src = courseImages[index % courseImages.length];
      //courseCard.appendChild(cardImg);

      courseCard.addEventListener("click", async function () {
        openInNewTab(course[1])
      });
      courseList.appendChild(courseCard);
    });
  } else if (selectedCourses.length==0) {
    courseList.textContent = "No courses available for this semester.";
  }
}
displayCourses(eduData,1);

//remove admin button
const addCourseButton = document.querySelector(".re-direct");
addCourseButton.style.display = "none";


document.addEventListener('click', function(event) {
  if (event.target.classList.contains('btn')) {
      const buttonId = event.target.id;
      displayCourses(eduData,buttonId)
      console.log('Button ID:', buttonId);
  }
});
