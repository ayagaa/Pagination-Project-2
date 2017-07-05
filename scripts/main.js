// jQuery object that holds the original list of students
// all student details are here and can be used to filter
// during search
const $mainStudentList = $('.student-item');
//The amount of students that the user wants to see per page
//of search results. Can be changed just by changing this value
const studentsPerPage = 10;

//Variable to hold the names of students during search
let studentName = '';
//Variable to hold the Email of students during search
let studentEmail = '';

//Create a search bar element
const $searchBar = $('<div class="student-search"><input placeholder="Search for students..."><button>Search</button></div>');

//unobtrusive JavaScript to append HTML for a search bar
//at loading time
$('.page-header').append($searchBar);

//Function that actually does the searching and returns
//a result an array of students filtered during search
//if the text input has no value. It will return all 
//the students in the original list $mainStudentList
const getSearchResults = () => {
    //Array to hold the search results
    let searchResult = [];
    //Boolean to indicate if a match has been found in 
    //either name or email comparison. This is to try and 
    //avoid duplicated in the final result set
    let isMatched = false;
    //Value from the search text input
    let query = $('.student-search input').val();
    //If value from search text input is null just return
    //the whole student list $mainStudentList
    //This will be executed only when the page is loading
    //and when the text input is on focusout event
    if (!query) {
        return $mainStudentList;
    } else {
        //Convert the search text to lowercase
        query = query.toLowerCase();
        //Loop through the whole student list and get matched items
        //Matched items are then added to the result array searchResult
        for (let i = 0; i < $mainStudentList.length; i++) {
            studentName = $mainStudentList[i].querySelector('.student-details h3').textContent.toLowerCase();
            studentEmail = $mainStudentList[i].querySelector('.email').textContent.toLowerCase();
            isMatched = false;
            if (studentName.includes(query) && !isMatched) {
                searchResult.push($mainStudentList[i]);
                isMatched = true;
            }
            if (studentEmail.includes(query) && !isMatched) {
                searchResult.push($mainStudentList[i]);
                isMatched = true;
            }
        }
        return searchResult;
    }
}

//Initially when the page is loading this file
//get all the students. This result set will then be used 
//in the pagination
//This variable will also be used to hold search results
// and then be used in pagination of the search results
let $studentItems = getSearchResults();
//Variable used to hold the count of all student details
//in the result set
let studentCount = $studentItems.length;
//Calculate the number of pages that will be needed in the
//pagination
let noPages = Math.ceil((studentCount / studentsPerPage));
// This function builds a list of students numbering (itemsPerPage) and displays it on the page.
// The students displayed depends on the page number passed to this function (pageNo). 
// The function should loop through all the students in the list (studentItems) and determine if each student is on this page. 
// It will show all the students on this page and hide the rest. 
const showPage = (pageNo, itemsPerPage, studentItems) => {
    //Hide all student details first
    $mainStudentList.hide();
    //Depending on the page number requested
    //determine the number of times we will loop through the student list
    //We dont have to loop through the entire list until we request the last page
    let loopCount = pageNo * itemsPerPage;
    //Where to start out loop
    let startPageIndex = loopCount - itemsPerPage;
    //Where to stop our loop
    let stopPageIndex = loopCount - 1;
    for (let i = startPageIndex; i < loopCount; i++) {
        //If we loop beyond the limit of the list we stop
        if (i > studentItems.length) break;
        //Create a jQuery item that we can use to show or hide
        //the details
        let $student = $(studentItems[i]);
        if (i >= startPageIndex && i <= stopPageIndex) {
            if (i <= studentItems.length - 1) {

                $student.show();
            }
        } else {
            $student.hide();
        }
    }
}

// This function creates all the page links based on a list of students. 
// It will determine how many pages we need based on the list's length, 
// create a list of links for each page, and append that list to the page. 
// When each link is clicked, we'll use the showPage function to display the corresponding page, 
// and mark the active link.
const appendPageLinks = () => {
    //Remove the container for the pagination list and links
    $('.pagination').remove();
    //Get the number of students in the result set
    studentCount = $studentItems.length;
    //If the number of items is greater than the number of items 
    //we want on each page then create the pagination list
    if (studentCount > studentsPerPage + 1) {
        //Create a new pagination container with an unordered list
        let $paginationDiv = $("<div class='pagination'> <ul></ul></div>");
        //Add the pagination container to the page
        $(".page").append($paginationDiv);
        //Calculate the number of pages that will be needed
        noPages = Math.ceil((studentCount / studentsPerPage));
        //Loop to create the number of pagination links we need
        for (let i = 1; i < noPages + 1; i++) {
            //Create a new list item with a link to click
            let $newPageLink = $('<li><a href="#">' + i + '</a></li>');
            //Add the new list item to the unordered list
            $('.pagination ul').append($newPageLink);
            //Attach a click event to the link element of the list item
            $newPageLink.children('a').on('click', (event) => {
                //When clicked it will remove the 'active' class from 
                //all other link items
                $('.pagination a').removeClass('active');
                //Show the page by calling the showPage function
                showPage(i, studentsPerPage, $studentItems);
                //assign the 'active' class to the clicked link element
                event.target.className = 'active';
            });
        }
    }
}

// The function takes a value from the input field, 
// and compares it to each student in the list. 
// If that value is found inside the name or email of a student, 
// that student is added to a new "matched" list. 
// If the "matched" list is empty, 
// then display a message that no matching students were found. 
// Otherwise, call the appendPageLinks function to create new pagination for the search results. 
// Then call the showPage function to display the first page of matched results.
const searchList = () => {
    //Clear previous pagination links
    $('.pagination').remove();
    //Gets the search result set by calling the getSearchResults function
    $studentItems = getSearchResults();
    //If the search result has more than ten matches
    //show the first page and create links if more than one
    //page is going to be needed
    if ($studentItems.length > 0) {
        $('.page-header h2').text("STUDENTS");
        showPage(1, studentsPerPage, $studentItems);
        appendPageLinks();
        //Select any first element of the pagination links
        //and add the active class
        $('.pagination li a').first().addClass('active');
    } else {
        //If no results hide all items
        //and give the use the message
        //no student’s found
        $mainStudentList.hide();
        $('.page-header h2').text("No student’s found");
    }
}

//Attach the click event to the search button at load time
$('.student-search button').on('click', () => {
    searchList();
});

//Attach the focusout event to the search input at load time
$('.student-search input').on('focusout', (event) => {
    if (event.target.value.length === 0) {
        searchList();
    }
});

//Remove any pagination 
$('.pagination').remove();
//Create and append pagination links
appendPageLinks();
//Select any first element of the pagination links
//and add the active class
$('.pagination li a').first().addClass('active');
//Show the first page at load time
showPage(1, studentsPerPage, $studentItems);