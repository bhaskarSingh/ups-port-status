const model = {
    //Get raw text data
    getData(){
        return fetch('../status_file.txt')
        .then((response) => {
            console.log(response);
            return response.text();
        })
    }
}

const presenter = {
    //Convert the raw data into structured data
    getStructuredData(){
        return model.getData()
        .then((text) => {
            return this.createStructuredData(text);
         });
    },

    /**
     * @description converts raw text data into structured nested
     * array data, keeping in mind that values should be seprated on the
     * basis of unique ports
     * @param {raw text file} text
     */
    createStructuredData(text){
        //convert each raw text line into array values
        const cells = text.split('\n').map(function (el) { return el.split(/\s+/); });
        //Main array which will contain all the nested arrays
        let mainArr = [];
        /* Temporary array to store unique ports array, and empty it when new unique port
        port data is added so as to avoid collison and make seprate nested array
        so that seprate table can be created for each unique port */
        let arr = [];
        for(let i =0; i < cells.length; i++){
            let index = i;
            //Get the last index of current value of unique port name
            const currentLastIndex= cells[i][0].indexOf(0);
            //Get the current name of the unique port, for example AG01 will get converted into --> AG
            const currentPortName = cells[i][0].substring(0, currentLastIndex);
            //Increment the index if loop isn't at its last loop
            if(i+1 < cells.length){
                index+=1;
            }

            //Get the last index of the next value of current value of unique port name
            const latterLastIndex = cells[index][0].indexOf(0);
            //Get the next value of current value of the unique port, for example AG01 will get converted into --> AG
            const latterPortName = cells[index][0].substring(0, latterLastIndex);

            //Add current array if current and next port name value is the same
            if(currentPortName === latterPortName){
                arr.push(cells[i]);
                //Add temp array to main array if the loop is at its last loop
                if(i === cells.length -1){
                    mainArr.push(arr);
                    arr = [];
                }
            } else {
                //Add current array to temp array once more before so that, we can make for the edge case
                //cause of comparison
                arr.push(cells[i]);
                //If not add the temp array to main array
                mainArr.push(arr);
                arr = [];
            }
        }
        return mainArr;
    },

    /* Method to create main parent toggle swtich to handle all child switches states */
    toggleMainSwitch(parentSwitchClass, childSwicheClass){
        console.log(parentSwitchClass, childSwicheClass);
        $(function(){
            //Main toggle switch
            $(parentSwitchClass).change(function() {
                if($(this).is(":checked")) {
                    openModalDialog();
                    $('#dismiss').click(() => {
                        //Set all the child switches state to block
                        $(parentSwitchClass).prop('checked', false);
                        $(childSwicheClass).prop('checked', false);
                        $(childSwicheClass).siblings('#profile-switch-lever').removeClass('green');
                        $(this).siblings().removeClass('green');
                        $(this).siblings().addClass('red');
                    })

                    $('#agree').click(() => {
                        console.log("Is checked");
                        //TODO: Add logic for parent switch here, if it's checked
                    })
                    //Set all the child switches state to unblock
                    $(childSwicheClass).prop('checked', true);
                    $(childSwicheClass).siblings('#profile-switch-lever').addClass('green');
                    $(this).siblings().addClass('green');
                }
                else {
                    openModalDialog();

                    $('#dismiss').click(() => {
                        //Set all the child switches state to unblock
                        $(parentSwitchClass).prop('checked', true);
                        $(childSwicheClass).prop('checked', true);
                        $(childSwicheClass).siblings('#profile-switch-lever').addClass('green');
                        $(this).siblings().addClass('green');
                    });

                    $('#agree').click(() => {
                        console.log("Is Not checked");
                        //TODO: Add logic for parent switch here, if it's not checked
                    });

                    //Set all the child switches state to block
                    $(childSwicheClass).prop('checked', false);
                    $(childSwicheClass).siblings('#profile-switch-lever').removeClass('green');
                    $(this).siblings().removeClass('green');
                    $(this).siblings().addClass('red');
                }
            });
        });
    },

    /* Link mainToggleSwitch to all the tables */
    linkMainToggleSwitchToTables(){
        this.getStructuredData()
        .then((structuredData) => {
            for(let i = 0; i < structuredData.length; i++){
                const LastIndex= structuredData[i][0][0].indexOf(0);
                const portName = structuredData[i][0][0].substring(0, LastIndex);
                console.log(portName);
                const parent = "." + portName + "Parent";
                const child = "." + portName + "Child";
                this.toggleMainSwitch(parent, child);
            }
        });
    },

    /* Listen for individual switch event within all child switches within all tables */
    listenForIndividualSwitchEvents(){
        $(function(){
             //Individual toggle switch
            $(".child-switch").change(function() {
                if($(this).is(":checked")) {
                    openModalDialog();
                    $('#dismiss').click(() => {
                        // console.log('dismiss');
                        $(this).prop('checked', false);
                        $(this).siblings().removeClass('green');
                        $(this).siblings().addClass('red');
                        $(this).parent('label').parent('.switch').parent('td').prev().prev().find('input[type=radio]').prop('checked', false);
                    });
                    $('#agree').click(() => {
                        console.log("Is checked");
                        // console.log($(this).parent('label').parent('.switch').parent('td').prev().prev().find('input[type=radio]'));
                        //TODO: Add logic here for if selected individual switch is on
                    });

                    $(this).siblings().addClass('green');
                    $(this).parent('label').parent('.switch').parent('td').prev().prev().find('input[type=radio]').prop('checked', true);
                }
                else {
                    openModalDialog();
                    $('#agree').click(() => {
                        console.log("Is Not checked");
                        //TODO: Add logic here for if selected individual switch is off
                    });

                    $('#dismiss').click(() => {
                        $(this).prop('checked', true);
                        $(this).siblings().addClass('green');
                        $(this).parent('label').parent('.switch').parent('td').prev().prev().find('input[type=radio]').prop('checked', true);
                    })

                    $(this).siblings().removeClass('green');
                    $(this).siblings().addClass('red');
                    $(this).parent('label').parent('.switch').parent('td').prev().prev().find('input[type=radio]').prop('checked', false);
                }
            });
        });
    }
}

const view = {
    /* display structured tables with unique ports values */
    render(){
        presenter.getStructuredData()
        .then((structuredData) => {
            // console.log(structuredData);
            return this.createTable(structuredData);
        })
        .then((tables) => {
            $('main').append(tables);
        });
        //Link mainToggle switches to tables
        presenter.linkMainToggleSwitchToTables();
        //Link Individual switches to table
        presenter.listenForIndividualSwitchEvents();
    },

    /* Create multiple tables distinguished by unique port names */
    createTable(data){
        let arr = [];

        for(let i = 0; i < data.length; i++ ){
            console.log(data[i][0][0].substring(0, 2));
            const lastIndex= data[i][0][0].indexOf(0);
            const portName = data[i][0][0].substring(0, lastIndex);
            const template =
            `<table class="centered">
                <thead>
                    <tr>
                        <th>${portName} PORTS</th>
                        <th>BLOCK</th>
                        <th>
                            <!-- Switch -->
                            <div class="switch">
                                <label>
                                block all
                                <input id="profile-switch-input" class="${portName}Parent"  type="checkbox" >
                                <span id="profile-switch-lever"  class="lever red"></span>
                                unblock all
                                </label>
                            </div>
                        </th>
                        <th>UNBLOCK</th>
                    </tr>
                </thead>
                <tbody>
                    ${ this.getTableData(data[i], portName+"Child") }
                </tbody>
            </table>`
            arr.push(template);
        }
    
        return arr;
    },

    /* get the table data */
    getTableData(data, child){
        return data.map((item) => {
            console.log(item[1])
            const setCheckboxState = (item[1] === 'OP'? 'checked' : '');
            const setCheckboxColor = (item[1] === 'OP'? 'green' : 'red');
            return (
                `<tr>
                <td>
                    <label>
                        <input type="radio" class="${child}" disabled="disabled" ${setCheckboxState} />
                        <span>${item[0]}</span>
                    </label>
                </td>
                <td>BLOCK</td>
                <td>
                    <div class="switch">
                        <label>
                        block
                        <input id="profile-switch-input" class="${child} child-switch" type="checkbox" ${setCheckboxState} >
                        <span id="profile-switch-lever"  class="lever ${setCheckboxColor}"></span>
                        unblock
                        </label>
                    </div>
                </td>
                <td>UNBLOCK</td>
                </tr>`
            );
        });
    }

}

view.render();

function createModalDialog(){
    const modal = `
    <div id="modal1" class="modal">
        <div class="modal-content">
            <h5>Are you sure you want to change port status</h5>
        </div>
        <div class="modal-footer">
            <button href="#!" id="dismiss" class=" modal-action modal-close waves-effect waves-green btn-flat">Dismiss</button>
            <button href="#!" id="agree" class=" modal-action modal-close waves-effect waves-green btn-flat blue white-text">Agree</button>
        </div>
    </div>`

    $('body').append(modal);
}

function removeModalDialog(){
    $('#modal1').remove();
}

function openModalDialog(options = {dismissible: false, onCloseEnd: () => { removeModalDialog(); }}){
    createModalDialog();
    const Modalelem = document.querySelector('.modal');
    const instance = M.Modal.init(Modalelem, options);
    const val = instance.open();
}