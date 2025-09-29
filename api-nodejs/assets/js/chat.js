var controller = (function () {
  var $chatCircle,
    $chatBox,
    $chatBoxClose,
    $chatBoxWelcome,
    $chatWraper,
    $submitBtn,
    $chatInput;

  function hideCircle(evt) {
    evt.preventDefault();
    $chatCircle.hide('scale');
    $chatBox.show('scale');
    $chatBoxWelcome.css('display', 'flex');
  }

  function chatBoxCl(evt) {
    evt.preventDefault();
    $chatCircle.show('scale');
    $chatBox.hide('scale');
    $chatBoxWelcome.hide('scale');
    $chatWraper.hide('scale');
  }

  function chatOpenMessage(evt) {
    evt.preventDefault();
    $chatBoxWelcome.hide();
    $chatWraper.show();
  }

  function submitMsg(evt) {
    evt.preventDefault();
    msg = $chatSubmitBtn.val();
    if (msg.trim() == '') {
      return false;
    }
    callbot(msg);
    generate_message(msg, 'self');
  }

  function chatSbmBtn(evt) {
    if (evt.keyCode === 13 || evt.which === 13) {
      console.log("btn pushed");
    }
  }

  function init() {
    $chatCircle = $("#chat-circle");
    $chatBox = $(".chat-box");
    $chatBoxClose = $(".chat-box-toggle");
    $chatBoxWelcome = $(".chat-box-welcome__header");
    $chatWraper = $("#chat-box__wraper");
    $chatInput = $("#chat-input__text");
    $submitBtn = $("#chat-submit");

    $chatCircle.on("click", hideCircle);
    $chatBoxClose.on("click", chatBoxCl);
    $chatInput.on("click", chatOpenMessage);
    $submitBtn.on("click", chatSbmBtn);
    $chatInput.on("keypress", chatSbmBtn);
  }

  return {
    init: init
  };

})();

function copyToClipboard(text, element) {
  var tempInput = document.createElement("input");

  tempInput.value = text;
  document.body.appendChild(tempInput);
  tempInput.select();
  document.execCommand("copy");
  document.body.removeChild(tempInput);

  element.textContent = "copied";
}

$('.chat-input__form').on('submit', function (e) {
  e.preventDefault();
  var msg = $('.chat-input__text').val();
  $('.chat-logs').append('<div id="cm-msg-0" class="chat-msg background-warning push-right bot"><div class="cm-msg-text">' + msg + '</div><span class="msg-avatar avatar-you">You</span></div>');

  $('.chat-logs').scrollTop($('.chat-logs')[0].scrollHeight);

  $.ajax({
    type: "POST",
    url: "/gen-chat",
    data: {
      message: msg
    },
    beforeSend: function() {
      $('.chat-logs').scrollTop($('.chat-logs')[0].scrollHeight);
      $('.spin-container').show('scale');
      $('#chat-submit').prop('disabled', true);
      $('#chat-input__text').prop('disabled', true);
    },
    success: function(response){
      $('.chat-logs').append('<div id="cm-msg-0" class="chat-msg background-warning push-right bot">' +
        '<div class="cm-msg-text">' +
        response +
        '<p class="clipboard-btn" onclick="copyToClipboard(\`' + response + '\`, this)">copy</p>' +
        '</div>' +
        '<span class="msg-avatar avatar-you">Bot</span>' +
        '</div>');
      $('.chat-input__text').val('');
    },
    error: function(err){
      $('.chat-logs').append('<div id="cm-msg-0" class="chat-msg background-warning push-right bot"><div class="cm-msg-text">' + err + '</div><span class="msg-avatar avatar-you">Bot</span></div>');
    },
    complete: function() {
      $('.chat-logs').scrollTop($('.chat-logs')[0].scrollHeight);
      $('.spin-container').hide('scale');
      $('#chat-submit').prop('disabled', false);
      $('#chat-input__text').prop('disabled', false);
    }
  })
});

$(document).ready(controller.init);
