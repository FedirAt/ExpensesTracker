"use strict";
//Track your expences by adding daily expences to local storage and watch history of previous operations by choosed day

//VARIABLES
const addBtn = document.getElementById("buttonAdd");
const searchBtn = document.getElementById("changeDate");
const table = document.querySelector("table");
const tableBody = document.querySelector("tbody");
const clearBtn = document.getElementById("buttonClear");
const clearFields = document.getElementById("clearFields");
const tableFoot = document.querySelector("tfoot");
class Operation {
  constructor (item, sum, date) {
    this.item = item;
    this.sum = sum;
    this.date = date;
  }
};
//set today date by default
const todayDate = new Date();
const setDay = function () {
  if (todayDate.getDate() < 10) {
    return "0" + todayDate.getDate();
  } else {
    return todayDate.getDate();
  }
};
const todayDay = setDay(),
      todayMonth = ("0" + (todayDate.getMonth() + 1)).slice(-2),
      todayYear = todayDate.getFullYear(),
      today = todayYear + "-" + todayMonth + "-" + todayDay;
document.getElementById("reportDate").value = today;


//FUNCTIONS
//function for default table fo current date:
function makeTable(day) {
  let ls = JSON.parse(localStorage.getItem("operations"));
  if (ls !== null) {
    let item = ls.item;
    let sum = ls.sum;
    let date = ls.date;
    for (var i = 0; i < ls.length; i++) {
      if (ls[i].date === day) {
        let rows = document.getElementsByTagName("tr");
        let num = rows.length - 1;
        let newRow = tableBody.insertRow();
          newRow.innerHTML = `
            <td>${num}</td>
            <td>${ls[i].item}</td>
            <td>${parseFloat(ls[i].sum / 100 * 100).toFixed(2)}</td>
            <td>${ls[i].date}</td>
            <td><a href="#" class="delete">X</a></td>
          `;
      }
    }
  }
};

//clear table function:
function clearTable() {
  document.querySelector("tbody").innerHTML = "";
}

//add operation to the table function:
function addOperToTable(item, sum, date) {
  let rows = document.getElementsByTagName("tr");
  let num = rows.length - 1;
  let newRow = tableBody.insertRow();
  let operation = new Operation(item, sum, date);
    newRow.innerHTML = `
      <td>${num}</td>
      <td>${operation.item}</td>
      <td>${parseFloat(operation.sum / 100 * 100).toFixed(2)}</td>
      <td>${operation.date}</td>
      <td><a href="#" class="delete">X</a></td>
    `;
};

//Add TOTAL row:
function addTotalRow() {
  let ls = JSON.parse(localStorage.getItem("operations"));
  let totRows = document.getElementsByTagName("tr");
  let changedDate = document.getElementById("reportDate").value;
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
    if (ls[i].date === changedDate) {
      totSum += ls[i].sum;
    }
  }
  //"put" sum in total row
tableFoot.children[0].children[1].textContent = parseFloat(totSum / 100 * 100).toFixed(2);
};


//add operation to LS function:
function addToLs(item, sum, date) {
  let operInLs = [];
  if (localStorage.getItem("operations") === null) {
    operInLs = [];
  } else {
    operInLs = JSON.parse(localStorage.getItem("operations"));
  }
  let operation = new Operation(item, sum, date);
  operInLs.push(operation);
  localStorage.setItem("operations", JSON.stringify(operInLs));
}

//clear inputs function:
function clearInputs() {
  document.getElementById("itemName").value = "";
  document.getElementById("itemSum").value = "";
  document.getElementById("itemDate").value = "";
};

//create dropdown list function:
function addItemToList() {
  let dataList = document.getElementById("items");
  dataList.innerHTML = "";
  let list = JSON.parse(localStorage.getItem("operations"));
  let listArr = [];
  let newList = [];
  if (list === null) {
    list = [];
  }
  //create array from LS items
  for (var i = 0; i < list.length; i++) {
  listArr.push(list[i].item);
}
  //create array with unique values(item names)
  for (var i = 0; i < listArr.length; i++) {
    if (newList.indexOf(listArr[i]) == -1) {
      newList.push(listArr[i]);
    }
  }
  //apend items to datalist
    for (var i = 0; i < newList.length; i++) {
      let option = document.createElement("option");
      let item = newList[i];
      option.innerHTML = item;
      dataList.appendChild(option);
    }
};


//FUNCTIONALITY
//defoult table fo current date:
makeTable(today);
addTotalRow();
//create dropdown list:
addItemToList();
//search-button listener - show operations for selected date:
searchBtn.addEventListener("click", function () {
  clearTable();
  let choosedDate = document.getElementById("reportDate").value;
  makeTable(choosedDate);
  addTotalRow();
});
//add-button listener - add new operation:
addBtn.addEventListener("click", function () {
  let date = document.getElementById("itemDate").value;
  let item = document.getElementById("itemName").value.toUpperCase();
  let sum = Number(document.getElementById("itemSum").value);
  if (item === "" || sum == 0 || date === "") {
    return alert("Please, fill the fields");
  } else {
    let choosedDate = document.getElementById("itemDate").value;
    if (choosedDate === today) {
      //add operation to the table
      addOperToTable(item, sum, date);
    }
  }
  //add operation to LS
  addToLs(item, sum, date);
  //refresh the table
  clearTable();
  makeTable(today);
  addTotalRow();
  //add item to list
  addItemToList();
  clearInputs();
});
//clear fields:
clearFields.addEventListener("click", clearInputs);
//clear LS and table:
clearBtn.addEventListener("click", function () {
  clearTable();
  localStorage.clear();
});
//remove item:
  table.addEventListener("click", function (e) {
    if (e.target.classList.contains("delete")) {
      let list = JSON.parse(localStorage.getItem("operations"));
      //from LS
      for (var i = 0; i < list.length; i++) {
        if (e.target.parentElement.previousElementSibling.textContent  === list[i].date && e.target.parentElement.previousElementSibling.previousElementSibling.textContent == list[i].sum && e.target.parentElement.previousElementSibling.previousElementSibling.previousElementSibling.textContent === list[i].item) {
          list.splice(list[i], 1);
        }
      }
      //from table
    e.target.parentElement.parentElement.remove();

    //set new array to LS
    localStorage.setItem("operations", JSON.stringify(list));
    //update table
    clearTable();
    makeTable(document.getElementById("reportDate").value);
    e.preventDefault();
   }
  });
