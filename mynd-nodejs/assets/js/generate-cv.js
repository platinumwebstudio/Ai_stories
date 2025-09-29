var actionPerformed = false;

function concatenateValues() {
  return $('.project-environment').map(function() {
    return $(this).text();
  }).get().join(',');
}

function checkCompleteness() {
  var allCompleated = true;
  $('.wait-data').each(function() {
    if (!$(this).hasClass('compleated')) {
      allCompleated = false;
      return false;
    }
  });

  if (allCompleated && !actionPerformed) {
    actionPerformed = true;

    var concatenatedValues = concatenateValues();
    console.log(concatenatedValues);

    $.ajax({
      type: "POST",
      url: "/gen-summary",
      data: {
        years: $('#years-of-experience').val(),
        technologies: concatenatedValues,
        position: $('.general-position').text(),
        environments: $('#environments-sum').val()
      },
      success: function(response){
        // Insert description into .project-description-33 element
        $('.user-summary').text(response.description).addClass('compleated');

        var separateList = response.professional_summary;
        var summaryList = $('<ul>');
        $('<li class="editable">').text(response.general_experience).appendTo(summaryList);
        for (var key in separateList) {
          $('<li class="editable">').text(separateList[key]).appendTo(summaryList);
        }

        var addBtn = $('<button>').text('Add');
        summaryList.append(addBtn);

        var separateList2 = response.professional_summary2;
        var summaryList2 = $('<ul>');
        $('<li class="editable">').text(response.general_experience).appendTo(summaryList2);
        for (var key2 in separateList2) {
          $('<li class="editable">').text(separateList2[key2]).appendTo(summaryList2);
        }

        var addBtn2 = $('<button>').text('Add');
        summaryList2.append(addBtn2);

        addBtn.click(function(event) {
          event.stopPropagation();

          var newLi = $('<li class="editable edit-true">');
          var newTextarea = $('<textarea class="textarea-editable">');
          var newSaveBtn = $('<button>').text('Save');


          newLi.append(newTextarea, newSaveBtn);

          newLi.insertBefore(addBtn);

          newSaveBtn.click(function(event) {
            event.stopPropagation();

            var newText = newTextarea.val();
            newLi.text(newText);
            newTextarea.remove();
            newSaveBtn.remove();

            newLi.removeClass('edit-true')
          });
        });

        $('.user-summary').html(summaryList).addClass('compleated');
        $('.user-summary-2').html(summaryList2).addClass('compleated');

        checkCompleteness();
      },
      error: function(){
        alert("Error retrieving project data!");
      }
    })
  }
}
