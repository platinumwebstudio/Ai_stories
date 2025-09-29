$(document).ready(function() {
  $(document).on('click', '.editable', function(event) {
    var $this = $(this);

    if (!$this.hasClass('edit-true')) {
      event.stopPropagation();

      var text = $this.text().trim();
      var textarea = $('<textarea class="textarea-editable">').val(text);
      var saveBtn = $('<button>').text('Save');

      $this.addClass('edit-true');

      $this.empty().append(textarea, saveBtn);

      saveBtn.click(function(event) {
        event.stopPropagation();

        var newText = textarea.val();
        $this.text(newText);
        textarea.remove();
        saveBtn.remove();

        $this.removeClass('edit-true'); // Remove the edit-true class after saving
      });
    }
  });
});
