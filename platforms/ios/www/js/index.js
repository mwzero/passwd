var passwdDB;
var item2Remove;
var alias2Remove;
var password2Remove;

var db = {
    
    open: function() {
		passwdDB = window.openDatabase("passwd", "1.0", "PassWD DB", 1000000);
		passwdDB.transaction ( function (tx) {
			//tx.executeSql('DROP TABLE IF EXISTS Passwords');
     		tx.executeSql('CREATE TABLE IF NOT EXISTS passwords (alias, password)');
		});
    },
    
    add : function(alias, password) {
    	passwdDB.transaction (function (tx) {
			var fields = '"' + alias + '","' + password + '"';
    		tx.executeSql('insert into Passwords (alias, password) values (' + fields + ')');
		});
    },
	
	deleteAliasPassword : function(alias, password) {
		passwdDB.transaction (function (tx) {
			//var fields = '"' + alias + '","' + password + '"';
    		//tx.executeSql('delete from Passwords where alias="' + alias + '" and password= "' + password + '"');
			var fields = '"' + alias + '"';
    		tx.executeSql('delete from Passwords where alias="' + alias + '"');
		});
	},
    
    list: function(querySuccess) {
     	
		passwdDB.transaction (function (tx) {
    		tx.executeSql('SELECT * FROM Passwords', [], querySuccess, password.error);
		});
    },
    
    error: function (err) {
        alert("Something wrong with db: " + err);
    },

    success: function () {
   		console.log("success");
        alert("success!");
    }
}

var password = {
	
	buildPassword: function() {
		var upperCharset = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
		var lowerCharset = "abcdefghijklnopqrstuvwxyz";
		var digitsCharset = "0123456789";
		var specialCharset = "!@#$%_&*";
		
		//retrieve fiedls
		var alias = $("#txtAlias").val();
		var length = $("#length").val();
		if ( length == "")
			length=8;
		var upper = $("#chkUpper").is(':checked');
		var lower = $("#chkLower").is(':checked');
		var digits = $("#chkDigits").is(':checked');
		var special = $("#chkSpecial").is(':checked');
		
		var charset = "";
		if (upper) charset = upperCharset;
		if (lower) charset += lowerCharset;
		if (digits) charset += digitsCharset;
		if (special) charset += specialCharset;

		retVal = "";
		for (var i = 0, n = charset.length; i < length; ++i) {
		    retVal += charset.charAt(Math.floor(Math.random() * n));
		}
		
		return retVal;
	},
    build: function() {
		
		var retVal = password.buildPassword();
		$("#txtPassword").val(retVal);
		$.mobile.changePage( "#dlgSavePassword", { role: "dialog" } );
		
		
    },
	
	rebuild: function() {
		var retVal = password.buildPassword();
		$("#txtPassword").val(retVal);
    },
    
    save: function() {
    	db.add ($("#txtAlias").val(), $("#txtPassword").val());
		$( "#dlgSavePassword" ).dialog( "close" );
		$("#txtAlias").val("");
		//have to blank everything
    },
	
	deleteConfirm: function() {
		$("#" + item2Remove).remove();
		
		db.deleteAliasPassword (alias2Remove, password2Remove);
		
		$('#liElencoSchede').listview("refresh");
		$( "#dlgDeletePassword" ).dialog( "close" );
	},
	
	deleteCancel: function() {
		$( "#dlgDeletePassword" ).dialog( "close" );
	},
	
	newPassword: function () {
		$.mobile.changePage( "#nuovapassword", { transition: "slideup"} );
	},
     list: function() {
     	db.list(password.querySuccess);
    },
    
    querySuccess: function(tx, results) {
   		var len = results.rows.length;
        console.log("table: " + len + " rows found.");
        
        $('#liElencoSchede').html("");
        
        var html = '<li id="mettielenco" data-role="list-divider" role="heading">Passwords</li>';
        $('#liElencoSchede').append(html);
        
        for (var i=0; i<len; i++) {
        	var row = "row"+i;
        	html = '<li id="' + row + '" data-theme="c">';
        	html+= '<a href="#"><h2>' + results.rows.item(i).alias + '</h2>';
			html+= '<p class="ui-li-aside"><strong>' + results.rows.item(i).password + '</strong></p></a>';
        	html+= '<a href="javascript: deleteItem(\'' + row + '\',\'' +  results.rows.item(i).alias  + '\',\'' +  results.rows.item(i).password  +  '\');" class="delete">Delete</a>';
			//html+= '<a href="#dialogpage" data-rel="popup" data-position-to="window" data-transition="pop">Delete</a>';
        	html+= '</li>';
        	 $('#liElencoSchede').append(html);
        }
       
        $.mobile.changePage( "#elencopassword", { transition: "slideup"} );
         $('#liElencoSchede').listview("refresh");
    }
}

var app = {

    initialize: function() {
	
		this.bindEvents();
    },
    
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
        
        $("#btnGenerate").on("tap", password.build);
		$("#btnReGenerate").on("tap", password.rebuild);
		
		$("#btnSave").on("tap", password.save);
        $("#btnListPasswords").on("tap", password.list);
		$("#btnNewPassoword").on("tap", password.newPassword);
		
		$("#btnDeleteConfirm").on("tap", password.deleteConfirm);
		$("#btnDeleteCancel").on("tap", password.deleteCancel);
		
		
       
        db.open();
        /*
        $( '#elencopassword' ).live( 'pageinit',function(event){
  			alert( 'This page was just enhanced by jQuery Mobile!' );
  			password.list();
		});
		*/
    },
    
    onDeviceReady: function() {
        //console.log('Received Event: deviceready');
    }
    
    
};

function deleteItem( item, alias, password ) {
	$.mobile.changePage( "#dlgDeletePassword", { role: "dialog" } );
	item2Remove = item;
	alias2Remove = alias;
	password2Remove = password;
	
}
