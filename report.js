// this page shows report for choosed month with items summed by names


//VARIABLES
const showReportButton = document.querySelector("#showReport");
const tbody = document.querySelector("tbody");
const table = document.querySelector("table");
const tableFoot = document.querySelector("tfoot");
const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
//set current month
const todayDate = new Date();
    todayMonth = ("0" + (todayDate.getMonth() + 1)).slice(-2),
    todayYear = todayDate.getFullYear();
const currentMonth = todayYear + "-" + todayMonth;
//set current month by default
document.getElementById("reportMonth").value = currentMonth;


//FUNCTIONS
//show operations for choosed month (similar items summed)
function createReport() {
  let month = document.getElementById("reportMonth").value;
  let thisMonthOper = JSON.parse(localStorage.getItem("operations"));
  let reportObj = {};
  document.querySelector("tbody").innerHTML = "";
  if (thisMonthOper === null) {
    thisMonthOper = [];
  }
  for (var i = 0; i < thisMonthOper.length; i++) {
    let operationsMonth = thisMonthOper[i].date[0]+thisMonthOper[i].date[1]+thisMonthOper[i].date[2]+thisMonthOper[i].date[3]+thisMonthOper[i].date[4]+thisMonthOper[i].date[5]+thisMonthOper[i].date[6];
    //create object from LS info
    if (operationsMonth === month) {
      if (reportObj.hasOwnProperty(thisMonthOper[i].item)) {
        reportObj[thisMonthOper[i].item] += thisMonthOper[i].sum;
      } else {
        reportObj[thisMonthOper[i].item] = thisMonthOper[i].sum;
      }
    }
  }
  //create report table
    let items = Object.keys(reportObj);
    let values = Object.values(reportObj);
    for (var i = 0; i < items.length; i++) {
      let newRow = tbody.insertRow();
      let rows = table.getElementsByTagName("tr");
      let num = rows.length - 2;
      newRow.innerHTML = `
        <td>${num}</td>
        <td>${items[i]}</td>
        <td>${parseFloat(values[i] / 100 * 100).toFixed(2)}</td>
        <td>${months[month.slice(5,7)-1] + "-" + month.slice(0,4)}</td>
      `;
    }
}
//Add TOTAL row
function addTotalRow() {
  let ls = JSON.parse(localStorage.getItem("operations"));
  let totRows = document.getElementsByTagName("tr");
  let changedDate = document.getElementById("reportMonth").value;
  //show total row
  if (totRows.length > 3) {
    tableFoot.children[0].classList.remove("total");
  }
  if (totRows.length <= 3) {
    tableFoot.children[0].classList.add("total");
  }
  //sum items
  let totSum = Number();
  for (var i = 0; i < ls.length; i++) {
    let month = ls[i].date[0]+ls[i].date[1]+ls[i].date[2]+ls[i].date[3]+ls[i].date[4]+ls[i].date[5]+ls[i].date[6];
    if (month === changedDate) {
      totSum += ls[i].sum;
    }
  }
  //"put" sum in total row
tableFoot.children[0].children[1].textContent = parseFloat(totSum / 100 * 100).toFixed(2);
};


//FUNCTIONALITY
//show operations for current month by default
createReport();
addTotalRow();
//show operation for choosed month
showReportButton.addEventListener("click", function () {
  createReport();
  addTotalRow();
});
//clear LS and table
buttonClear.addEventListener("click", function () {
  document.querySelector("tbody").innerHTML = "";
  localStorage.clear();
});
