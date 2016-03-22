//common useful functions

var utils = {}

utils.encodeCSV = function(txt){
    return txt.replace(/,/g, "ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¸").replace(/(\r\n|\n|\r)/gm," ");
}

utils.exportCSV = function(csv, title){
    
    var link = $("#export_link");
    if(link.length==0){
    	$("body").append('<a id="export_link" href=""></a>');
    	setTimeout(function(){utils.exportCSV(csv);},100);
    	return;
    }
	link.attr("download", title+".csv");

	link.attr("href", 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv));
	setTimeout(function(){
	    link[0].click();
	    link.attr("href","");
	},100);
}

utils.weeklyReload = function(){
	//weekly reload minimizes memory leaks
    setTimeout(function(){
      location.reload();
    }, 7*24*60*60*1000);
}



/*to use: 
1. include jquery-ui
2. add class="hidden" to dialog
*/
function dialog(params){

    //jquery-ui dialog
    //to use: dialog{title:... , message:...}

    var id = params.id || "dialog";

    if(id==="dialog"){
        $("#"+id).html(params.message);
    }
    

    if($("#"+id).length==0){
        $("body").append('<div id="'+id+'"></div>');
        setTimeout(function(){dialog(params);},100);
        return;
    }


    var buttons = {};

    if(params.buttons != null){
        buttons = {
            Cancel: function() {
                $(this).dialog("close");
            }
        }
        $.extend(buttons, params.buttons);
    }


    var di = $("#"+id).dialog({
        show: { effect: "fade", duration: 500 },
        hide: { effect: "fade", duration: 500 },
        title: params.title,
        width:  params.width || 'auto',
        dialogClass: params.class || '',
        buttons : buttons,
        closeOnEscape: true,
        modal:true,
        open: function(){
            $('.ui-widget-overlay').bind('click',function(){
                $("#"+id).dialog('close');
            });

            $(document).trigger( "dialogOpen", id);
        }
    });

    //add css
    di = di.parent();
    di.addClass("box");
    di.find(".ui-dialog-titlebar-close, button").addClass("minor_button");
    if(di.find('.ui-dialog-buttonset button').length>1){
        di.find(".ui-dialog-buttonset button:last-child").removeClass("minor_button").addClass("major_button");
    }
};


function message(str, cls){
    //show message tooltip
    //to use: need div class="top" on top of page

    $(".top").attr("title","").tooltip({
        content: str,
        tooltipClass: cls || "message"
    }).tooltip("open");

    $(".ui-tooltip").bind('click', function(){
        $(".top").tooltip("close");
    });

    setTimeout(function(){
        $(".top").tooltip({content: ''}).tooltip( "close" );
    },5000);
};

function error(str){
    message(str, "error");
}

function displayDate(ts, timezone){

    if(undefined == timezone){
        timezone = -1*(new Date()).getTimezoneOffset()*60*1000;
    }

    var display = new Date( Date.parse(ts) + (1*timezone));
    display = display.toUTCString();
    //Mon, 19 Jan 2015 13:30:00 GMT

    var time = display.substring(display.indexOf(":")-2, display.lastIndexOf(":"));

    //19 Jan 13:30
    var date = display.substring(display.indexOf(",")+2, display.indexOf(":"));
    date=date.substring(0,date.lastIndexOf(" "));
    date=date.substring(0,date.lastIndexOf(" "));
    
    return date+" "+time;
}