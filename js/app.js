$(document).ready(function() {


    function toggleMainSwitch(parentSwitchClass, childSwicheClass){
        //Main toggle switch
        $(parentSwitchClass).change(function() {
            if($(this).is(":checked")) {
                console.log("Is checked");
                //Set all the child switches state to unblock
                $(childSwicheClass).prop('checked', true);
                $(childSwicheClass).siblings().addClass('green');
                $(this).siblings().addClass('green');
            }
            else {
                console.log("Is Not checked");
                //Set all the child switches state to block
                $(childSwicheClass).prop('checked', false);
                $(childSwicheClass).siblings().removeClass('green');
                $(this).siblings().removeClass('green');
                $(this).siblings().addClass('red');
            }
        });
    }
    
    toggleMainSwitch('.agPortsParent', '.agPortsChild');
    toggleMainSwitch('.vnPortParent', '.vnPortChild');
    toggleMainSwitch('.ngccPortParent', '.ngccPortChild');

    //Individual toggle switch
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