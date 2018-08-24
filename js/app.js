$(document).ready(function() {


    function toggleMainSwitch(parentSwitchClass, childSwicheClass){
        //Main toggle switch
        $(parentSwitchClass).change(function() {
            if($(this).is(":checked")) {
                console.log("Is checked");
                //Set all the child switches state to unblock
                $(childSwicheClass).prop('checked', true);
                $(childSwicheClass).siblings('#profile-switch-lever').addClass('green');
                $(this).siblings().addClass('green');
            }
            else {
                console.log("Is Not checked");
                //Set all the child switches state to block
                $(childSwicheClass).prop('checked', false);
                $(childSwicheClass).siblings('#profile-switch-lever').removeClass('green');
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
            $(this).parent('label').parent('.switch').parent('td').prev().prev().find('input[type=radio]')
            .prop('checked', true);
            console.log($(this).parent('label').parent('.switch').parent('td').prev().prev().find('input[type=radio]'));
        }
        else {
            console.log("Is Not checked");
            $(this).siblings().removeClass('green');
            $(this).siblings().addClass('red');
            $(this).parent('label').parent('.switch').parent('td').prev().prev().find('input[type=radio]')
            .prop('checked', false);
        }
    })
});