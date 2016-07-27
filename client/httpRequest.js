
var url = document.getElementById('url');
var jobid = document.getElementById('jobid');
var inputForm = document.getElementById('inputForm');
var jobInput = document.getElementById('jobInput');

// Sends POST request to job queue api endpoint
url.addEventListener("submit", function(evt) {
    removeResults(this);
    evt.preventDefault();
    $.ajax({
      type: "POST",
      url: 'http://localhost:8080/submitredis',
      data: {url: inputForm.value},
      success: function (jobId) {
        alert(`The Job ID for ${inputForm.value} is ${jobId}`);
      },
      error: function (error) {
        console.log('error in clientside post request to newWebsite endpoint', error);
      }
    });
});

// Sends GET request to retrieve job status or website from DB
jobid.addEventListener("submit", function(evt) {
    removeResults(this);
    evt.preventDefault();
    $.ajax({
      type: "GET",
      url: 'http://localhost:8080/getwebsite/'+jobInput.value,
      success: function (results) {
        var status = '';
        var html = '';
        if (results.pos === null) {
          status = "No job found. Try submitting a website first"
        } else if (results.pos >= 0) {
          status = `The website has not yet been processed! It is ${results.pos} away from being archived`;
        } else {
          status = `The results for job# ${results.id} from ${results.url} is:`  ;
          html = results.content;
        }

        addResults(status, html);
      },
      error: function (error) {
        console.log('error in clientside get request to from endpoint', error);
      }
    });
}, true);

// Adds results of request to server to page
function addResults(status, html) {
      document.getElementById('result').innerHTML = html;
      document.getElementById('status').innerHTML = status

  }
// Removes results of request from the page
function removeResults(input) {
      document.getElementById('result').innerHTML = '';
      document.getElementById('status').innerHTML = '';
  }
