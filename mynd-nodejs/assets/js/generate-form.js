$(document).ready(function(){
  // Add Experience
  $("#addExperience").click(function(){
    var experience = $(".experience").first().clone();
    experience.find("input, textarea").val("");
    // Remove "Currently Working" checkbox from cloned experiences
    experience.find('.workingNow').remove();
    experience.find('.workingNowLabel').remove();
    // Remove disabled attribute from cloned experiences
    experience.find('.dateEnd').prop('disabled', false);
    $("#experiences").append(experience);
    updateRemoveButtonState();
  });

  // Remove Experience
  $("#experiences").on("click", ".removeExperience", function(){
    $(this).closest(".experience").remove();
    updateRemoveButtonState();
  });

  function updateRemoveButtonState() {
    var experiencesCount = $(".experience").length;
    if (experiencesCount <= 1) {
      $(".removeExperience").prop("disabled", true);
    } else {
      $(".removeExperience").prop("disabled", false);
    }
  }

  // Handle "Currently Working" checkbox
  $("#experiences").on("change", ".workingNow", function(){
    var dateEndInput = $(this).closest(".experience").find(".dateEnd");
    if (this.checked) {
      dateEndInput.prop("disabled", true);
      dateEndInput.removeAttr("required");
      dateEndInput.val(""); // Clear the value if currently working
    } else {
      dateEndInput.prop("disabled", false);
      dateEndInput.attr("required", true);
    }
  });

  // Form Submission
  $("#jobApplicationForm").submit(function(e){
    // Perform validation
    var isValid = true;
    $("#jobApplicationForm input[required], #jobApplicationForm textarea[required]").each(function(){
      if(!$(this).val()){
        isValid = false;
        $(this).addClass("error");
      } else {
        $(this).removeClass("error");
      }
    });

    if(!isValid){
      alert("Please fill out all required fields.");
      e.preventDefault(); // Prevent form submission if validation fails
    }
  });

  updateRemoveButtonState();
});
