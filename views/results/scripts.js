// jshint jquery: true
var results = document.getElementById('results');

if (results) {

  var i = 0;
  var id = setInterval(function () {
    i++;
    if (i > 60) clearInterval(id);

    $.ajax({
      type: 'GET',
      url: 'http://127.0.0.1:1923/results.txt',
      dataType: 'text',
      success: function (response) {
        results.textContent = response;
      }
    });

  }, 500);

}