var onLoadFunction = function() {
  console.log('\'Allo \'Allo!');
  var ironAjax = document.querySelector("iron-ajax");
  ironAjax.addEventListener('response', function (e) {
    var res = e.detail.response;
    console.log(res);
    var timeline = new TL.Timeline('timeline-embed', res);
  });
  ironAjax.url = "./data/data.json";
  ironAjax.generateRequest();
};
window.addEventListener( 'load', onLoadFunction, false );
