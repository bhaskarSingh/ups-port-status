$(document).ready(function() {
    $("input").change(function() {
        if($(this).is(":checked")) {
            console.log("Is checked");
            $(this).children().addClass('red');
        }
        else {
            console.log("Is Not checked");
        }
    })
});