$(document).ready(function() {
    $("input").change(function() {
        if($(this).is(":checked")) {
            console.log("Is checked");
            $(this).siblings().addClass('green');
        }
        else {
            console.log("Is Not checked");
            $(this).siblings().removeClass('green');
            $(this).siblings().addClass('red');
        }
    })
});