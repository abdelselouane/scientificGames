var editor = CodeMirror.fromTextArea(document.getElementById("demotext"), {
	      lineNumbers: true,
	      mode: "application/ld+json",
	      theme: "paraiso-dark",
	      indentUnit: 1,
	      smartIndent: true,
	      tabSize: 3,
	      lineWrapping: true,
	      showCursorWhenSelecting: true,
	      historyEventDelay: 10,

	      
	    });
        
        $(document).ready(function() {
            
            $.getScript( "js/data/users.js", function( data, textStatus, jqxhr ) {
                editor.setValue( data );
            });
            
            var getContent = function( users ){
                if(users){
                    var content = '';
                    for(var i=0; i < users.length; i++){
                        content +=  "<tr><td>#"+(i+1)+"</td>";
                        for (key in users[i]) {
                            content += "<td data-id='"+i+"' data-name='"+key+"' class='edit'>"+users[i][key]+"</td>";
                        }
                        content +=  "<td>&nbsp;<a href='#' class='preview' data-id='"+i+"' data-toggle='modal' data-target='#myModal'><span data-id='"+i+"' class='glyphicon glyphicon-eye-open'></span></a>&nbsp;<a class='update' data-id='"+i+"' data-toggle='modal' data-target='#myModal' href='#'><span data-id='"+i+"' class='glyphicon glyphicon-edit'></span></a>&nbsp;<a href='#'><span data-id='"+i+"' class='glyphicon glyphicon-trash'></span></a>&nbsp;</td></tr>";
                    }
                    return content;
                }
                return false;
            }
            
            var loadContent = function( users ){
                $('#table-content').html(getContent(users));
            }
            
            var saveUsers = function( obj ){
                $.ajax({
                  url: "users.php",
                  type: "POST",
                  data: { users : obj },
                  success: function( response ){

                      //console.log(response);

                  }
                });
            }
            
            var getUser = function( users, id ){
                //console.log(users[id]); return false;
                if(users)
                    return users[id];
                else
                    return false;
            }
            
           if(users && users.length !== 0){
            
                loadContent( users );
                var tableObj = $('#user_listing');
			    tableObj.dataTable().editableTableWidget();
           }
           
            
            $('#user_submit').click(function(){
                var id = this.getAttribute('data-id');
                var action = this.getAttribute('data-action');
                //console.log(action);
                //return false;
                
                var formObj = {};
                var inputs = $('#user_form').serializeArray();
                
                $.each(inputs, function (i, input) {
                    formObj[input.name] = input.value;
                });
                
                if( action == 'add'){
                     users.push(formObj);
                }else{
                    users[id].name = formObj.name;
                    users[id].phone = formObj.phone;
                    users[id].title = formObj.title;
                    users[id].office = formObj.office;
                }
                //console.log( users );
                //return false;
                saveUsers( users );
                window.location = "index.html";
            });
        
            $('.edit').on('change', function(evt, newValue) {
                
                var id = this.getAttribute('data-id');
                var field = this.getAttribute('data-name');
               
                if (newValue !== '') {
                    users[id][field] = newValue;
                    saveUsers( users );
                    window.location = "index.html";
                }else{
                    
                    console.log('can not be empty');
                }
            });
                
            $('.glyphicon-trash').click(function(){
                var id = this.getAttribute('data-id');
                if( users.length > 1){
                    if (confirm("Do you really want to delete this user, are you sure?")) {
                         var removedObject = users.splice(id,1);
                         saveUsers( users );
                         window.location = "index.html";
                    }
                }else{
                    alert("This user is the last registered user, it can not be deleted");
                }
                return false;
            });
           
            $('#add_user').click(function(){
                 $('#myModalLabel').html('<span class="glyphicon glyphicon-user"></span> Add User');
                 $('#name').val('').removeAttr('disabled');
                 $('#phone').val('').removeAttr('disabled');
                 $('#title').val('').removeAttr('disabled');
                 $('#office').val('').removeAttr('disabled');
                 $('#user_submit').removeAttr('disabled');
                 $('#user_submit').attr( "data-id", "" );
                 $('#user_submit').attr( "data-action", "add" );
                 $('#myModal').trigger('click');
            });
            
			$('.preview').click(function (event) {
                var id = this.getAttribute('data-id');
                var user = getUser(users, id);
                $('#myModalLabel').html('<span class="glyphicon glyphicon-user"></span> Preview User');
                $('#name').val(user.name).attr( "disabled", "disabled" );
                $('#phone').val(user.phone).attr( "disabled", "disabled" );
                $('#title').val(user.title).attr( "disabled", "disabled" );
                $('#office').val(user.office).attr( "disabled", "disabled" );
                $('#user_submit').attr( "disabled", "disabled" );
                $('#myModal').trigger('click');
            });
            
            $('.update').click(function (event) {
                var id = this.getAttribute('data-id');
                var user = getUser(users, id);
                $('#myModalLabel').html('<span class="glyphicon glyphicon-user"></span> Edit User');
                $('#name').val(user.name).removeAttr('disabled');;
                $('#phone').val(user.phone).removeAttr('disabled');;
                $('#title').val(user.title).removeAttr('disabled');;
                $('#office').val(user.office).removeAttr('disabled');;
                $('#user_submit').removeAttr('disabled');
                $('#user_submit').attr( "data-id", id );
                $('#user_submit').attr( "data-action", "edit" );
                $('#myModal').trigger('click');
            });
		});