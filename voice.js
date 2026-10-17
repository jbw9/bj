(function () {
  var WORDS = {
    ace: 1, one: 1, won: 1, two: 2, to: 2, too: 2, three: 3, four: 4, for: 4, five: 5,
    six: 6, seven: 7, eight: 8, ate: 8, nine: 9, ten: 10, jack: 10, queen: 10, king: 10, face: 10
  };

  // Pure: transcript -> array of ranks 1..10, with 0 meaning "undo".
  function parseTranscript(text) {
    var out = [];
    (text.toLowerCase().match(/[a-z]+|\d+/g) || []).forEach(function (tok) {
      if (/^\d/.test(tok)) {
        (tok.match(/10|[1-9]/g) || []).forEach(function (d) { out.push(+d); });
      } else if (tok === "undo" || tok === "back") {
        out.push(0);
      } else if (WORDS[tok]) {
        out.push(WORDS[tok]);
      }
    });
    return out;
  }

  var SR = window.webkitSpeechRecognition || window.SpeechRecognition;
  var btn = document.getElementById("mic");
  if (!btn) return;
  var rec = null, enabled = false;

  function stop(state, msg) {
    enabled = false;
    if (rec) { try { rec.stop(); } catch (e) {} }
    window.setVoiceState(state, msg);
  }

  function start() {
    rec = new SR();
    rec.lang = "en-US";
    rec.continuous = true;
    rec.interimResults = false;
    rec.onresult = function (e) {
      for (var i = e.resultIndex; i < e.results.length; i++) {
        if (!e.results[i].isFinal) continue;
        parseTranscript(e.results[i][0].transcript).forEach(function (r) {
          if (r === 0) window.undoCard(); else window.addCard(r);
        });
      }
    };
    rec.onerror = function (e) {
      if (e.error === "not-allowed" || e.error === "service-not-allowed") {
        stop("error", "Microphone blocked");
      }
    };
    rec.onend = function () {
      if (enabled) { try { rec.start(); } catch (e) { stop("off"); } }
    };
    enabled = true;
    rec.start();
    window.setVoiceState("listening");
  }

  btn.addEventListener("click", function () {
    if (!SR) return window.setVoiceState("error", "Voice needs Chrome, Edge or Safari");
    if (enabled) stop("off"); else start();
  });
})();
