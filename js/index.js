var seq = 0, delays = 40, durations = 250;
var seq2 = 0, delays2 = 40, durations2 = 250;

function initEcharts(id, xData, yData, name, type, unit) {
	var myChart = echarts.init(document.getElementById(id));
	var option = {
			title: {
		        text: name,
		        textStyle:{    
		        	fontWeight:'normal'
	            },
		        subtext: "单位("+unit+")",
		    },
			tooltip: {
		        trigger: 'axis',
		        axisPointer: {
		            animation: true
		        }
		    },
		    xAxis: {
		        type: 'category',
		        boundaryGap: false,
		        axisLabel: { 
		        	show: true,
		        	rotate: -20,
		        	textStyle: {
		        		color: '#ccc' 
		        		}
		        	},
	        	axisLine:{
	                lineStyle:{
	                    color:'#ccc',
	                },
	            },
		        data: xData
		    },
		    yAxis: {
		        boundaryGap: [0, '50%'],
		        axisLabel: { 
		        	show: true,
		        	textStyle: {
		        		color: '#ccc' 
		        		}
		        	},
		        type: 'value'
		    },
		    series: [
		        {
		            name: name,
		            type: type,
		            itemStyle:{    
			            normal:{
			            	lineStyle:{ color:'#60BDFD'}
			            }
		            },
		            /*symbol: 'none',
		            areaStyle: {
		                normal: {
		                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
		                        offset: 0,
		                        color: '#50BDFD'
		                    }, {
		                        offset: 1,
		                        color: '#60BDFD'
		                    }])
		                }
		            },*/
		            data: yData
		        }
		    ]
		};
		myChart.setOption(option);
		return myChart;
}
function initEcharts02(id, xData, yData, type, high) {
	data = {
        labels: xData,
        series: [
                 {
                	 data:yData
                 }
        ]
    };

    options = {
        lineSmooth: Chartist.Interpolation.cardinal({
            tension: 0
        }),
        low: 0,
        high: high, // creative tim: we recommend you to set the high sa the biggest value + something for a better look
        chartPadding: { top: 0, right: 0, bottom: 0, left: 0},
    };

    
    if(type=="line"){
    	var dailySalesChart = new Chartist.Line("#"+id, data, options);
    	animationChart.startAnimationForLineChart(dailySalesChart);
    }else if(type=="bar"){
    	var dailySalesChart = new Chartist.Bar("#"+id, data, options);
    	animationChart.startAnimationForBarChart(dailySalesChart);
    }
    
}
var animationChart = {
	startAnimationForLineChart: function(chart){
	
	    chart.on('draw', function(data) {
	      if(data.type === 'line' || data.type === 'area') {
	        data.element.animate({
	          d: {
	            begin: 600,
	            dur: 700,
	            from: data.path.clone().scale(1, 0).translate(0, data.chartRect.height()).stringify(),
	            to: data.path.clone().stringify(),
	            easing: Chartist.Svg.Easing.easeOutQuint
	          }
	        });
	      } else if(data.type === 'point') {
	            seq++;
	            data.element.animate({
	              opacity: {
	                begin: seq * delays,
	                dur: durations,
	                from: 0,
	                to: 1,
	                easing: 'ease'
	              }
	            });
	        }
	    });
	
	    seq = 0;
	},
	startAnimationForBarChart: function(chart){
	
	    chart.on('draw', function(data) {
	      if(data.type === 'bar'){
	          seq2++;
	          data.element.animate({
	            opacity: {
	              begin: seq2 * delays2,
	              dur: durations2,
	              from: 0,
	              to: 1,
	              easing: 'ease'
	            }
	          });
	      }
	    });
	
	    seq2 = 0;
	}
};
$.fn.dataTable.ext.feature.push( {
	fnInit: function ( settings ) {
		if ( settings.sDom.indexOf('L') > 0  && settings.oFeatures.bPaginate && settings.oFeatures.bLengthChange ){
			var
				classes = settings.oClasses,
				tableId = settings.sTableId;

			var input = $('<input/>', {
				'name': tableId + '_length',
				'aria-controls': tableId,
				'class': classes.sLengthSelect,
				'type':'num'
			});

			var div = $('<div><label/></div>').addClass(classes.sLength );
			if ( ! settings.aanFeatures.L ) {
				div[0].id = tableId+'_length';
			}

			div.children().append(
				settings.oLanguage.sLengthMenu.replace( '_MENU_',input.prop("outerHTML") )
			);

			$('input', div)
				.val( settings._iDisplayLength )
				.bind('keyup.DT', function(e) {
					$(this).val($(this).val().replace(/[^\d]/g,''));
					if($(this).val() == '0' || $(this).val() == ''){
						$(this).val('');
					}else {
						settings.oApi._fnLengthChange( settings, $(this).val() );
						settings.oApi._fnDraw(settings );
					}
				} )
				.bind('blur.DT', function(e) {
					if(!$(this).val()){
						$(this).val('10');
						settings.oApi._fnLengthChange( settings, $(this).val() );
						settings.oApi._fnDraw(settings );
					}
				} );

			// Update node value whenever anything changes the table's length
			$(settings.nTable).bind( 'length.dt.DT', function (e, s, len) {
				if ( settings === s ) {
					$('input', div).val( len );
				}
			} );

			return div[0];
		}
	},
	cFeature: 'L'
} );

$.extend( true, $.fn.DataTable.ext.classes, {
	"sLengthSelect": "table-length-input",
} );

$.extend( true, $.fn.dataTable.defaults, {
	"dom":"<'dataTables_Info'Lp>"+
	"t"+
	"ip"
} );

//dtatTable 公共参数
var tableOpions = {
	"bProcessing" : false,
	"bServerSide": true, //指定从服务器端获取数据
	"sAjaxSource" : "",
	"fnServerData" : "", //与后台交互获取数据的处理函数
	"bDestroy" : true, //将之前的那个数据对象清除掉，换以新的对象设置
	"bRetrieve" : true, //用于指明当执行dataTable绑定时，是否返回DataTable对象
	"sAjaxDataProp" : "list",
	"lengthChange" : true,
	"pageLength":10,//每页加载条数
	"bFilter" : false,
	"bAutoWidth" : false,
	"bSort" : false,
	"fnDrawCallback": "",
	"pagingType": "simple",
	"rowId": "_id",
	"aoColumns" :  [],
	"language":{
		"oAria": {
			"sSortAscending": ": 升序排列",
			"sSortDescending": ": 降序排列"
		},
		"oPaginate": {
			"sFirst":    "首页",
			"sPrevious": "前一页",
			"sNext":     "后一页",
			"sLast":     "尾页"
		},
		"sEmptyTable": "没有相关记录",
		"sInfo": "第 _START_ 到 _END_ 条记录，共 _TOTAL_ 条",
		"sInfoEmpty": "第 0 到 0 条记录，共 0 条",
		"sInfoFiltered": "(从 _MAX_ 条记录中检索)",
		"sInfoPostFix": "",
		"sDecimal": "",
		"sThousands": ",",
		"sLengthMenu": "每页显示 _MENU_ 条",
		"sLoadingRecords": "正在载入...",
		"sProcessing": "正在载入...",
		"sSearch": "",
		"sSearchPlaceholder": "",
		"sUrl": "",
		"sZeroRecords": "没有相关记录",
		"select": {
			rows: {
				_: "。已选择 %d 行",
				0: ""
				//1: "Only 1 row selected"
			}
		}
	},
	"aoColumnDefs": [{
		sDefaultContent: '',
		aTargets: ['_all']
	}]
};
function conversionPages(start,rows){
	return (start / rows + 1);
}
//checkbox全选
function selectAll(id) {
	var table = $("#"+id).DataTable();
	$("#"+id+" th input[type='checkbox']").prop("checked",false);
    $("#"+id+" th input[type='checkbox']").click(function () {
        if ($(this).prop("checked") === true) {
            table.rows().select();
        } else {
            table.rows().deselect();
        }
    });
}
function selectSidebar(obj){
	$("#navbar-collapse").load("sidebar.html",function(){
		setTimeout("$('#accordion ."+obj+"').parent().parent().addClass('in');$('#accordion ."+obj+"').addClass('active');",100);
		
		/*var id = $("#accordion ."+obj).parent().parent().attr("id");
		$("a[href='#"+id+"']").addClass("active");*/
		/*$("#accordion ."+obj).parent().parent().addClass("in");
		$("#accordion ."+obj).addClass("active");*/
		
	});
}
