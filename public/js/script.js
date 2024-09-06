$(window).load(function() {
  $('.flexslider').flexslider({
    animation: "slide",
    controlNav: false,
    directionNav: false,
    slideshowSpeed: 4000,
  });
});

$(window).load(function() {
  isUS();
  $('#country').on("change", function(){
    isUS();
  })
});

function isUS() {
    countrySelect = $('#country');
    console.log(countrySelect);
    let country = countrySelect.find(":selected").val();
    if (country == "US") {
      $('#state-label').removeClass("hidden");
      $('#state').removeClass("hidden");
    }
    else {
      $('#state-label').addClass("hidden");
      $('#state').addClass("hidden");
    }
}