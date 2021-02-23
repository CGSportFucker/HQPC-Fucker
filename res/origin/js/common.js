/**
 * 鍛藉悕绌洪棿
 */
jQuery.namespace = function() {
    var a = arguments,
        o = null,
        i, j, d, rt;
    for (i = 0; i < a.length; ++i) {
        d = a[i].split(".");
        rt = d[0];
        eval('if (typeof ' + rt + ' == "undefined"){' + rt + ' = {};} o = ' + rt + ';');
        for (j = 1; j < d.length; ++j) {
            o[d[j]] = o[d[j]] || {};
            o = o[d[j]];
        }
    }
}

jQuery.namespace('tp.dic');
tp.dic.data = {
    get: function(code) {
        //濡傛灉椤甸潰涓婃病鏈夌紦瀛�
        if (!tp.dic.data[code]) {
            $.ajax({
                url: contextpath + "/sys/uacm/dicm/dic",
                async: false,
                type: "POST",
                data: {
                    code: code
                },
                success: function(ret_dic) {
                    tp.dic.data[code] = ret_dic;
                },
                error: function() {
                    if (window.console) {
                        console.log("鑾峰彇" + code + "瀛楀吀琛ㄥけ璐�");
                    }
                }
            });
        }
        return tp.dic.data[code];
    }
};

tp.dic.language = {
    get: function(code) {
        if (isI18n != 'true' || Util.isChinese(code)) {
            //濡傛灉娌℃湁鍚敤鍥介檯鍖�
            return code;
        }
        //濡傛灉椤甸潰涓婃病鏈夌紦瀛�
        if (!tp.dic.language[code]) {
            $.ajax({
                url: contextpath + "/sys/uacm/language/data",
                async: false,
                dataType: 'text',
                type: "POST",
                data: {
                    code: code
                },
                success: function(ret_dic) {
                    //濡傛灉寮€鍚簡鍥介檯鍖栵紝骞朵笖娌℃湁鑾峰彇鍒癱ode瀵瑰簲鐨勫€硷紝鍒欑洿鎺ヨ繑鍥瀋ode
                    if (ret_dic) {
                        tp.dic.language[code] = ret_dic;
                    } else {
                        tp.dic.language[code] = code;
                    }
                },
                error: function() {
                    if (window.console) {
                        console.log("鑾峰彇" + code + "鍥介檯鍖栧け璐�");
                    }
                }
            });
        }
        return tp.dic.language[code];
    }
}

/**
 * 鑾峰彇URL涓婇潰鐨勫弬鏁�
 * @param $
 */
;
(function($) {
    $.extend({
        getParameter: function(name) {
            function parseParams() {
                var params = {},
                    e,
                    a = /\+/g, // Regex for replacing addition symbol with a space  
                    r = /([^&=]+)=?([^&]*)/g,
                    d = function(s) { return decodeURIComponent(s.replace(a, " ")); },
                    q = window.location.search.substring(1);

                while (e = r.exec(q))
                    params[d(e[1])] = d(e[2]);

                return params;
            }

            if (!this.queryStringParams)
                this.queryStringParams = parseParams();

            return this.queryStringParams[name];
        }
    });
})(jQuery);

/**
 * form琛ㄥ崟搴忓垪鍖栦负json
 */
$.fn.serializeJson = function() {
    var serializeObj = {};
    $(this.serializeArray()).each(function() {
        serializeObj[this.name] = this.value;
    });
    return serializeObj;
};


/**
 * 鏃ユ湡鏍煎紡鍖�
 */
(function($) {
    $.formatDate = function(pattern, date) {
        //濡傛灉涓嶈缃紝榛樿涓哄綋鍓嶆椂闂�  
        if (!date) date = new Date();
        if (typeof(date) === "string" || typeof(date) === "number") {
            if (date == "") {
                date = new Date()
            } else {
                date = new Date((date + "").replace(/-/g, "/") * 1);
            }

        }
        /*琛�00*/
        var toFixedWidth = function(value) {
            var result = 100 + value;
            return result.toString().substring(1);
        };

        /*閰嶇疆*/
        var options = {
            regeExp: /(yyyy|M+|d+|h+|m+|s+|ee+|ws?|p)/g,
            months: ['January', 'February', 'March', 'April', 'May',
                'June', 'July', 'August', 'September',
                'October', 'November', 'December'
            ],
            weeks: ['Sunday', 'Monday', 'Tuesday',
                'Wednesday', 'Thursday', 'Friday',
                'Saturday'
            ]
        };

        /*鏃堕棿鍒囨崲*/
        var swithHours = function(hours) {
            return hours < 12 ? "AM" : "PM";
        };

        /*閰嶇疆鍊�*/
        var pattrnValue = {
            "yyyy": date.getFullYear(), //骞翠唤  
            "MM": toFixedWidth(date.getMonth() + 1), //鏈堜唤  
            "dd": toFixedWidth(date.getDate()), //鏃ユ湡  
            "hh": toFixedWidth(date.getHours()), //灏忔椂  
            "mm": toFixedWidth(date.getMinutes()), //鍒嗛挓  
            "ss": toFixedWidth(date.getSeconds()), //绉�  
            "ee": options.months[date.getMonth()], //鏈堜唤鍚嶇О  
            "ws": options.weeks[date.getDay()], //鏄熸湡鍚嶇О  
            "M": date.getMonth() + 1,
            "d": date.getDate(),
            "h": date.getHours(),
            "m": date.getMinutes(),
            "s": date.getSeconds(),
            "p": swithHours(date.getHours())
        };

        return pattern.replace(options.regeExp, function() {
            return pattrnValue[arguments[0]];
        });
    };

})(jQuery);

/**
 * json瀵硅薄load鍒癴orm涓�
 */
$.fn.loadFormData = function(data) {
    return this.each(function() {
        var input, name;
        if (data == null) { this.reset(); return; }
        for (var i = 0; i < this.length; i++) {
            input = this.elements[i];
            //checkbox鐨刵ame鍙兘鏄痭ame[]鏁扮粍褰㈠紡
            name = (input.type == "checkbox") ? input.name.replace(/(.+)\[\]$/, "$1") : input.name;
            if (data[name] == undefined) continue;
            switch (input.type) {
                case "checkbox":
                    if (data[name] == "") {
                        input.checked = false;
                    } else {
                        //鏁扮粍鏌ユ壘鍏冪礌
                        if (data[name].indexOf(input.value) > -1) {
                            input.checked = true;
                        } else {
                            input.checked = false;
                        }
                    }
                    break;
                case "radio":
                    if (data[name] == "") {
                        input.checked = false;
                    } else if (input.value == data[name]) {
                        input.checked = true;
                    }
                    break;
                case "button":
                    break;
                default:
                    input.value = data[name];
            }
        }
    });
};

/**
 * 鍏叡鏂规硶
 */
var Util = {
    load: function(url, before, after) {
        layer.closeAll();
        if (url) {

            Util.run = null;
            $(window).unbind("hashchange");
            $.ajaxSetup({ cache: true });

            // 澧炲姞澶栭儴宓屽叆
            url = decodeURIComponent(url);
            if (url.indexOf("http://") != -1) {
                $("#page-content").html("<iframe id='tpContainerIframe' src='" + url + "' style='width:100%;height:690px; border: medium none;'/>");
                window.addEventListener('message', function(e) {
                    $("#tpContainerIframe").height(e.data);
                });
                return;
            }

            var perm_item_id = $("a[perm_item_url='" + url + "']").attr("perm_item_id");

            //				try{
            //					if (!!(window.attachEvent && !window.opera)) {
            //					 	document.execCommand("stop"); 
            //					} else {
            //					 	window.stop();
            //					}
            //				}catch(e){}

            $("#page-content").load(url, "item_id=" + perm_item_id, function(data, status, xhr) {
                //濡傛灉鍔犺浇鏃跺€欏嚭鐜伴敊璇�
                if (xhr.status == '0' && xhr.statusText == 'error') {
                    $(this).empty();
                    setTimeout("Msg.reloadPage()", 5000); //5绉掑悗鎻愮ず杩囨湡
                    return;
                } else if (status == "error" && (xhr.status == 500 || xhr.status == 404)) {
                    $("#page-content").html(data);
                }

                //瑙ｅ喅hash鍊煎悗闈㈠甫鍙傛暟鐨勯棶棰橈紙濡�#a=1?b=2杩欑鍐欐硶锛�
                if (url.indexOf("?") != -1) {
                    back_act_listener = url.substring(0, url.indexOf("?"));
                } else {
                    back_act_listener = url;
                }
                //娣诲姞鏁版嵁涓績闇€瑕佷娇鐢ㄧ殑鍙傛暟
                var finalMenuItem = Util.getHash(location.hash, 'finalMenuItem');
                var cpparams = Util.getHash(location.hash, 'cpparams');
                var targetact = "";
                if (cpparams != "cpparams" && cpparams != "") {
                    cpparams = template.BASE64.decode(cpparams);
                    cpparams = JSON.parse(cpparams);
                    targetact = cpparams.targetact;
                }
                //璁颁綇璺宠浆鐨勮彍鍗�(濡傛灉褰撶殑鍦板潃鍜屼紶閫掕繘鏉ョ殑涓嶄竴鏍�)
                var _act = Util.getHash(location.hash, 'act');
                if (_act != back_act_listener && _act.indexOf(back_act_listener + "?") == -1) {
                    if (!finalMenuItem && !Util.isNotEmpty(targetact)) {
                        Util.setHash("#act=" + back_act_listener);
                    }

                }
                //濡傛灉鏄厤缃钩鍙颁笉鍔犺浇杩愯鍓嶅嚱鏁�
                if (url.indexOf("cp/templateList/p") < 0 || (url.indexOf("cp/templateList/p") > -1 && cpparams == "")) {
                    //杩愯鍓嶅洖璋冨嚱鏁�
                    if (typeof before == 'function') {
                        before(data);
                    };
                }

                //鎵ц鍏ュ彛鍑芥暟
                if (Util.run && typeof Util.run == 'function') Util.run();

                //鍒濆鍖栭〉闈腑鐨勪笅鎷夊瓧鍏�
                Util.initSysDic();

                //鍒濆鍖栭〉闈腑鐨勬ā绯婂尮閰嶈嚜鍔ㄥ～鍏�
                Util.autocomplete();

                //杩愯鍚庡洖璋冨嚱鏁�
                if (typeof after == 'function') {
                    after(data);
                };

                //鐢ㄦ埛琛屼负璁板綍鍏ュ簱
                if (Util.UserBehaviorAnalysis) {
                    var leave = Date.parse(new Date()) / 1000;
                    Util.ajax({
                        url: contextpath + "/comm/ub",
                        param: $.extend(Util.UserBehaviorAnalysis, {
                            leave: leave,
                            location: url,
                            times: leave - Util.UserBehaviorAnalysis.now
                        })
                    });
                }
                var parser = new UAParser();
                Util.UserBehaviorAnalysis = {
                    now: Date.parse(new Date()) / 1000,
                    referrer: url,
                    browser: parser.getResult().browser.name,
                    browser_v: parser.getResult().browser.version,
                    os: parser.getResult().os.name,
                    os_v: parser.getResult().os.version,
                    device: parser.getResult().ua
                }

            });
            if (typeof window.globalTPCallback == 'function') {
                window.globalTPCallback();
            };
        }
    },
    /**
     * 閫氳繃 from 涓殑鏉′欢鍒嗛〉妫€绱㈡暟鎹垪琛�
     * @param data
     */
    getPageObjListByForm: function(data) {
        if (!data || !data.formId) {
            if (window.console) {
                console.log("鍙傛暟寮傚父锛氳閫氳繃鍙傛暟formId 鎸囧畾from鐨処D銆�");
            }
            return;
        }

        var _from = $("#" + data.formId);
        if (!_from.attr("action")) {
            if (window.console) {
                console.log('鍙傛暟寮傚父锛歩d涓�' + data.formId + '鐨刦orm灏氭湭閰嶇疆action灞炴€с€�');
            }
            return;
        }

        var param = {};
        var arr = _from.serializeArray();
        $(arr).each(function(i, o) {
            if (o.value != '') {
                if (param[o.name]) {
                    param[o.name] = param[o.name] + "," + o.value;
                } else {
                    param[o.name] = o.value;
                }
            }
        });
        data['data'] = $.extend(data.data, param);
        data['url'] = _from.attr("action");
        this.getPageObjList(data);
    },
    //閫氳繃鎸囧畾鍙傛暟{}鍒嗛〉鑾峰彇鏁版嵁
    getPageObjList: function(data) {
        if (!data || !data.url) {
            if (window.console) {
                console.log('getPageObjList鏂规硶涓皻鏈厤缃畊rl璇锋眰鍦板潃銆�');
            }
            return;
        }
        data.param = data.data || {};
        data.param['pageNum'] = data.param['pageNum'] || 1;
        data.param['pageSize'] = data.param['pageSize'] || 10;
        this.ajax(data);
    },
    /**
     * 閫氳繃 form 鎻愪氦琛ㄥ崟娣诲姞璁板綍
     * @param data
     */
    addByForm: function(data) {
        if (!data || !data.formId) {
            if (window.console) {
                console.log('鍙傛暟寮傚父锛氳閫氳繃鍙傛暟formId 鎸囧畾from鐨処D銆�');
            }
            return;
        }

        var _from = $("#" + data.formId);
        if (!_from.attr("action")) {
            if (window.console) {
                console.log('鍙傛暟寮傚父锛歩d涓�' + data.formId + '鐨刦orm灏氭湭閰嶇疆action灞炴€с€�');
            }
            return;
        }

        //濡傛灉鎸囨槑涓嶅幓鏍￠獙
        if (!data.ignoreValidate) {
            //濡傛灉鏈夎嚜瀹氫箟鐨勬牎楠岃鍒�
            if (data.validateRules && !_from.validate(data.validateRules).form()) {
                return;
            }
            if (!_from.validate().form()) {
                return;
            }
        }

        //鏍￠獙閫氳繃涔嬪悗锛屽線鍚庡彴鍙戣姹備箣鍓嶏紝灏嗘寜閽鐢紝閬垮厤閲嶅鎻愪氦
        $("#" + data.submitBtn).attr("disabled", "disabled");
        $("#" + data.cancelBtn).attr("disabled", "disabled");

        var param = {};
        //閬嶅巻form鍏冪礌
        var arr = _from.serializeArray();
        $(arr).each(function(i, o) {
            //				if(o.value!=''){
            if (param[o.name]) {
                param[o.name] = param[o.name] + "," + o.value;
            } else {
                param[o.name] = o.value;
            }
            //				}
        });
        //閬嶅巻鑷姩濉厖鍏冪礌锛岃鐩栨帀鍘熸湁鐨勫€�
        //			_from.find('input[autocomplete=true]').each(function(i,o){
        //				param[$(o).attr("name")] = $(o).attr("real-value") ;
        //			});
        data['param'] = $.extend(param, data.param);
        data['url'] = _from.attr("action");

        this.ajax(data);
    },
    /**
     * 涓庢湇鍔＄浜や簰
     * @param data
     */
    ajax: function(data) {
        if (!data || !data.url) {
            if (window.console) {
                console.log('ajax鏂规硶涓皻鏈厤缃畊rl璇锋眰鍦板潃銆�');
            }
            return;
        }
        var loading = "";
        $.ajax({
            type: data.method || "POST",
            url: data.url,
            async: data.async == undefined ? true : data.async,
            data: JSON.stringify(data.param || {}),
            dataType: data.dataType || "json",
            contentType: 'application/json;charset=utf-8',
            success: function(result) {
                if (data.success && typeof(data.success) == "function") {
                    data.success(result);
                }
            },
            error: function(err) {
                if (err.status == 200 && err.statusText == "OK" && data.success && typeof(data.success) == "function") {
                    data.success(err.responseText);
                    return;
                }
                if (data.error && typeof(data.error) == "function") {
                    data.error(err);
                }
            },
            beforeSend: function() {
                if (data.loading) {
                    loading = Msg.load(); //鍙戦€佽姹備箣鍓嶆樉绀簂oading
                }
            },
            complete: function(xhr) {
                if (xhr.status == 403) {
                    Msg.info(tp_common_quan_xian_bu_zu, function() {
                        Util.load(contextpath + "/403");
                    });
                }
                if (loading) Msg.close(loading);
                if (xhr.status == '0' && xhr.statusText == 'error') {
                    setTimeout("Msg.reloadPage()", 5000); //5绉掑悗鎻愮ず杩囨湡
                }
            }
        });
    },
    /**
     * layer鍒嗛〉
     * @param param
     * @param type 1锛氬彧鏄剧ずmini鍒嗛〉锛�2锛氭寜鐓у搴︽樉绀哄垎椤垫牱寮�
     */
    laypageMini: function(param, type) {
        var miniPage = '<div id="layer_page_' + param.pageId + '" class="bar pagejump-mini-con push-up-20">' +
            '	<div class="pagejump-box pull-right">' +
            '		<a id="mini_page_prev_' + param.pageId + '" class="prev fa fa-chevron-left"></a>' +
            '		<div class="pagejump-inputbox">' +
            '			<input id="mini_page_text_' + param.pageId + '" class="form-control pull-left" type="text"/>' +
            '		</div>' +
            '		<a id="mini_page_next_' + param.pageId + '" class="next fa fa-chevron-right"></a>' +
            '		<a id="mini_page_jump_' + param.pageId + '" class="btn btn-default pull-left push-left-10">' + tp_common_go + '</a>' +
            '	</div>' +
            '	<div class="pagejump-info pull-right"><span>' + param.data.pageNum + '</span><span>/</span><span>' + param.data.pages + '</span></div>' +
            '</div>';
        if (1 == type) {
            $("#" + param.pageId).html(miniPage);
        } else if (2 == type) {
            $("#" + param.pageId).append(miniPage);
            $("#layer_page_" + param.pageId).hide();
        }

        //鍚戝墠鐨勭洃鍚�
        $("#mini_page_prev_" + param.pageId).click(function() {
            if (param.data.pageNum != 1 && typeof(param.callback) == "function") {
                if (param.callbackParam && param.callbackParam.length > 0) {
                    param.callback(--param.data.pageNum, param.data.pageSize, param.callbackParam[0], param.callbackParam[1],
                        param.callbackParam[2], param.callbackParam[3], param.callbackParam[4],
                        param.callbackParam[5], param.callbackParam[6], param.callbackParam[7]);
                } else {
                    param.callback(--param.data.pageNum, param.data.pageSize);
                }
            }
        });
        //鍚戝悗鐨勭洃鍚�
        $("#mini_page_next_" + param.pageId).click(function() {
            if (param.data.pageNum != param.data.pages && typeof(param.callback) == "function") {
                if (param.callbackParam && param.callbackParam.length > 0) {
                    param.callback(++param.data.pageNum, param.data.pageSize, param.callbackParam[0], param.callbackParam[1],
                        param.callbackParam[2], param.callbackParam[3], param.callbackParam[4],
                        param.callbackParam[5], param.callbackParam[6], param.callbackParam[7]);
                } else {
                    param.callback(++param.data.pageNum, param.data.pageSize);
                }
            }
        });
        //璺宠浆鐨勭洃鍚�
        $("#mini_page_jump_" + param.pageId).click(function() {
            var page = $("#mini_page_text_" + param.pageId).val();
            if (page > 0 && page <= param.data.pages && typeof(param.callback) == "function") {
                param.callback(page, param.data.pageSize);
            }
        });
    },
    /**
     * 娓叉煋妯℃澘
     * @param param
     */
    renderTemplet: function(param) {
        if (!param || (!param.templetId && !param.contentHTML)) {
            if (window.console) {
                console.log('灏氭湭鎸囧畾妯℃澘銆�');
            }
        } else if (!param.containerId) {
            if (window.console) {
                console.log('灏氭湭鎸囧畾瀹瑰櫒Id銆�');
            }
        } else if (param.data == undefined || param.data == '') {
            $("#" + param.containerId).html(template(param.templetId));
        } else if (param.pageId && param.data.list && param.data.list.length > 0) {
            if (param.templetId) {
                $("#" + param.containerId).html(template(param.templetId, { 'data': param.data }));
            } else {
                var render = template.compile(param.contentHTML);
                $("#" + param.containerId).html(render({ 'data': param.data }));
            }
            if (param.pageId && param.data.pages > 0) {
                //鏄剧ず澹版槑mini鍒嗛〉
                if ("mini" == param.pageType) {
                    this.laypageMini(param, 1);
                    return;
                }
                //濡傛灉娌℃湁瀹氫箟涓� mini 锛屽垯鍒濆鍖栧搷搴斿紡鏄剧ず
                layui.laypage.render($.extend({
                    elem: param.pageId,
                    count: param.data.total,
                    curr: param.data.pageNum,
                    limit: param.data.pageSize,
                    limits: [10, 50, 100, 500, 1000]
                        //,theme : '#c00' 
                        ,
                    layout: ['limit', 'skip', 'prev', 'page', 'next'],
                    jump: function(obj, first) {
                        if (!first && typeof(param.callback) == "function") {
                            if (param.callbackParam && param.callbackParam.length > 0) {
                                param.callback(obj.curr, obj.limit, param.callbackParam[0], param.callbackParam[1],
                                    param.callbackParam[2], param.callbackParam[3], param.callbackParam[4],
                                    param.callbackParam[5], param.callbackParam[6], param.callbackParam[7]);
                            } else {
                                param.callback(obj.curr, obj.limit);
                            }
                        }
                    }
                }, param));
                //鍒濆鍖杕ini鍒嗛〉
                this.laypageMini(param, 2);

                $("#" + param.pageId + " ." + "layui-laypage").width("100%");
                $("#" + param.pageId + " ." + "layui-laypage-limits").addClass("pull-left");
                $("#" + param.pageId + " ." + "layui-laypage-skip").before('<span class="pull-left layui-laypage-count">褰撳墠绗� ' + param.data.startRow + ' - ' + param.data.endRow + ' 鏉� 鍏辫 ' + param.data.total + ' 鏉�</span>');

                //濡傛灉娌℃湁瀹氫箟涓� mini鎴栬€呮墿灞曡嚜瀹氫箟鍒嗛〉 锛屽垯鍝嶅簲寮忔樉绀�
                function assertShowPageTool() {
                    var wid = $(window).width();
                    if (wid < 960) {
                        $("#" + param.pageId + " ." + "layui-laypage").hide();
                        $("#layer_page_" + param.pageId).show();
                    } else {
                        $("#layer_page_" + param.pageId).hide();
                        $("#" + param.pageId + " ." + "layui-laypage").show();
                    }
                }
                var resizeTimer = null;
                $(window).bind('resize', function() {
                    if (resizeTimer) clearTimeout(resizeTimer);
                    resizeTimer = setTimeout(assertShowPageTool(), 500);
                });
                //鍝嶅簲寮忔樉绀�
                assertShowPageTool();
            }
        } else if (param.pageId && param.data.list && param.data.list.length == 0) {
            $("#" + param.containerId).html(tp_common_weijiansuodaojilu);
            $("#" + param.pageId).empty();
        } else if (param.data != undefined) {
            $("#" + param.containerId).html(template(param.templetId, param.data));
        } else {
            $("#" + param.containerId).html(tp_common_weijiansuodaojilu);
            $("#" + param.pageId).empty();
        }
        //鍒濆鍖栧瓧鍏�
        Util.initSysDic($("#" + param.containerId).find("select"));
        //鍒濆鍖栬嚜鍔ㄥ～鍏�
        Util.autocomplete($("#" + param.containerId).find("input[autocomplete=true]"));
        Util.autocomplete($("#" + param.containerId).find("input[automatictp=true]"));
    },
    /**
     * @param calback 鎴愬姛涔嬪悗鐨勫洖璋�
     * @param async true寮傛璋冪敤锛堥粯璁わ級锛沠alse鍚屾璋冪敤
     * @returns {String}
     */
    getToken: function(calback, async) {
        var token = "";
        $.ajax({
            url: contextpath + "/getToken",
            type: "POST",
            async: async === false ? false : true,
            success: function(data) {
                if (typeof calback == "function") {
                    calback(data);
                }
                token = data;
            }
        });
        return token;
    },
    /**
     * 鍒犻櫎閫変腑鐨勮褰�
     * @param data
     */
    deleteRecord: function(data) {
        if (!data || !data.url) {
            if (window.console) {
                console.log('璇蜂紶url鍙傛暟銆�');
            }
            return;
        }
        if (data.records.length > 0) {
            Msg.confirm(data.msg || tp_common_querenshanchu, function() {
                $.ajax({
                    url: data.url,
                    type: "POST",
                    data: {
                        ids: typeof data.records == 'object' ? data.records.join(',') : data.records,
                        mapping: data.mapping
                    },
                    success: function(result) {
                        //鍒犻櫎鎴愬姛涔嬪悗灏嗗閫夋鐨勭姸鎬佸彇娑�
                        $("input[type='checkbox']").prop('checked', false);
                        if (data.success && typeof(data.success) == "function") {
                            data.success(result);
                            Msg.success();
                        } else {
                            Msg.success();
                        }
                    },
                    error: function() {
                        Msg.error();
                    }
                });
            });
        } else {
            Msg.warning(tp_common_xuanzeshanchujilu);
        }
    },
    /**
     * 娓叉煋datatables
     * @param param
     * @returns
     */
    dataTables: function(param) {
        if (!param.NoKeyDown) {
            //鍥炶溅浜嬩欢formId
            $("#" + param.formId).keydown(function(e) {
                var e = e || event,
                    keycode = e.which || e.keyCode;
                if (keycode == 13 && common.action.dataTable) {
                    common.action.dataTable.ajax.reload();
                }
            });
        }
        if (!param.gridId) {
            if (window.console) {
                console.log('璇蜂紶閫掓覆鏌撶殑DOM鍏冪礌');
            }
            return;
        }
        if (!param.columns) {
            if (window.console) {
                console.log('璇蜂紶閫掓覆琛ㄦ牸鐨� columns 鍙傛暟');
            }
            return;
        }
        if (param.formId) {
            var _form = $("#" + param.formId);
            //濡傛灉 url 涓虹┖鍒欏皢form鐨刟ction浣滀负 url
            if (!param.url && $(_form).attr("action")) {
                param.url = $(_form).attr("action");
            }
            var fParam = {};
            var arr = _form.serializeArray();
            if (arr.length > 0) {
                //鑾峰彇form涓殑鎵€鏈夎〃鍗曢」
                $(arr).each(function(i, o) {
                    if (o.value != '') {
                        if (fParam[o.name]) {
                            fParam[o.name] = fParam[o.name] + "," + o.value;
                        } else {
                            fParam[o.name] = o.value;
                        }
                    }
                });
            }
            //form涓殑鍙傛暟闄勫姞鍒拌嚜宸变紶閫掔殑鍙傛暟
            param.data = $.extend(fParam, param.data);
        }

        if (!param.url && !param.localData) {
            if (window.console) {
                console.log('璇蜂紶閫掕姹傛暟鎹殑 url 鍙傛暟');
            }
            return;
        }
        //鍥哄畾鎿嶄綔鍒�-wenhm
        var is_opt = false;
        if ($('#' + param.gridId).find("thead tr").find("th:last-child").html() == "鎿嶄綔") {
            is_opt = true;
        }
        //榛樿鏄樉绀鸿鍙�
        //			if(param.hideRowNumber!=true){
        //				$("#"+param.gridId).find("tr").first().prepend("<th style='width: 56px;' id='"+param.gridId+"_dt_row_num'><i class='fa fa-list-ol'></i></th>");
        //				if(!(typeof param.columns[0].data=='function' && param.columns[0].data()=='dt_row_number')){
        //					param.columns.unshift({data: function(){return "dt_row_number";}});
        //				}
        //			}

        //鍥哄畾鎿嶄綔鍒�-wenhm
        var dataTablesPage = {
            //Custom lengthmenu style ren.jq
            sLengthMenu: '<div class="pull-left push-right-10">' + tp_common_meiyexianshi + '</div><select class="form-control pull-left select" style="font-size:12px;">' + '<option value="10">10</option>' + '<option value="50">50</option>' + '<option value="100">100</option>' + '<option value="500">500</option>' + '<option value="1000">1000</option>' + '</select><div class="pull-left push-left-10">' + tp_common_tiao + '</div>',
            sZeroRecords: tp_common_weijiansuodaojilu,
            //sProcessing : "&lt;img src=鈥�./loading.gif鈥� /&gt;",
            sInfo: tp_common_current_item + " _START_ - _END_ " + tp_common_tiao + "銆€" + tp_common_total_item + " _TOTAL_ " + tp_common_tiao,
            sInfoEmpty: tp_common_weijiansuodaojilu,
            sInfoFiltered: "(浠� _MAX_ 鏉¤褰曚腑杩囨护)",
            sSearch: "鎼滅储锛�",
            oPaginate: {
                sFirst: tp_common_shouye,
                sPrevious: tp_common_qianyiye,
                sNext: tp_common_houyiye,
                sLast: tp_common_weiye
            },
            sZeroRecords: tp_common_weijiansuodaojilu
        };
        //濡傛灉鏄痬ini鍒嗛〉
        if (param.pageType == "mini") {
            dataTablesPage = {
                sLengthMenu: '',
                sZeroRecords: tp_common_weijiansuodaojilu,
                sInfo: "",
                sInfoEmpty: tp_common_weijiansuodaojilu,
                sInfoFiltered: "",
                sSearch: "鎼滅储锛�",
                oPaginate: {
                    sFirst: tp_common_shouye,
                    sPrevious: "<<",
                    sNext: ">>",
                    sLast: tp_common_weiye
                },
                sZeroRecords: tp_common_weijiansuodaojilu
            };
        }
        var table = $.extend({
            processing: false, //鏄剧ず姝ｅ湪澶勭悊鐨勫姞杞�
            paging: true, //缈婚〉鍔熻兘  
            searching: false, //闅愯棌鎺夋绱㈡
            iDisplayLength: (param.data && param.data.pageSize) ? param.data.pageSize : 10,
            bFilter: false, //杩囨护鍔熻兘  
            bSort: false, //鎺掑簭鍔熻兘  
            bSortMulti: false,
            bSearchable: false,
            bInfo: true, //椤佃剼淇℃伅
            bLengthChange: true, //闅愯棌宸︿笂瑙掑垎椤�
            aLengthMenu: [
                [10, 50, 100, 500, 1000],
                [10, 50, 100, 500, 1000]
            ],
            fnDrawCallback: function(obj) {
                $('#' + param.gridId + "_length").find("select").each(function() {
                    $(this).selectpicker();
                });
                if (param.pageType == "mini") {
                    //濡傛灉鏄皬绐楀彛锛屽垯闅愯棌鑷畾涔夎烦杞�
                    $("#div_dt_pgo" + param.gridId).hide();
                    //绗嚑椤电殑鎸夐挳闅愯棌
                    $("#" + param.gridId + "_paginate").find("span").hide();
                }
                if (obj && obj.json && obj.json.total > 0) {
                    $('#' + param.gridId + "_length").show();
                } else {
                    $('#' + param.gridId + "_length").hide();
                }

                //鏂囨湰妗嗛敭鐩樼洃鍚烦杞埌绗嚑椤�
                function dt_pgo_key_up(e, _this) {
                    //鍙兘杈撳叆鏁板瓧
                    if (!/^\d+$/.test(_this.value)) {
                        _this.value = parseInt(_this.value);
                    }
                    if (e.keyCode == 13) {
                        //灏忔暟杞暣鏁�
                        this.value = parseInt(_this.value);
                        //澶т簬0鎵嶅垎椤�
                        if ($(_this).val() && $(_this).val() > 0) {
                            var redirectpage = $(_this).val() - 1;
                        } else {
                            var redirectpage = 0;
                        }
                        $('#' + param.gridId).dataTable().fnPageChange(redirectpage);
                    }
                }
                $('#dt_pgo' + param.gridId).keyup(function(e) {
                    dt_pgo_key_up(e);
                });
                $('#dt_mini_pgo' + param.gridId).keyup(function(e) {
                    dt_pgo_key_up(e, this);
                });

                //鐐瑰嚮璺宠浆鎸夐挳
                function jump_page_btn_go(input_dom) {
                    var redirectpage = $('#' + input_dom + param.gridId).val();
                    if (redirectpage > 0) {
                        $('#' + param.gridId).dataTable().fnPageChange(redirectpage - 1);
                    } else {
                        Msg.warning(tp_common_hefayema);
                    }
                }
                $("#jump_page_btn" + param.gridId).click(function() {
                    jump_page_btn_go("dt_pgo");
                });
                $("#jump_page_mini_btn" + param.gridId).click(function() {
                    jump_page_btn_go("dt_mini_pgo");
                });

                if (param.pageType != 'mini' && !param.sPaginationType) {
                    //濡傛灉娌℃湁瀹氫箟涓� mini鎴栬€呮墿灞曡嚜瀹氫箟鍒嗛〉 锛屽垯鍝嶅簲寮忔樉绀�
                    function assertShowFoobar() {
                        var wid = $(window).width();
                        if (wid < 960) {
                            $("#" + param.gridId + "_length").hide();
                            $("#" + param.gridId + "_info").hide();
                            $("#" + param.gridId + "_previous").text("<");
                            $("#" + param.gridId + "_next").text(">");
                            $("#div_dt_pgo" + param.gridId).hide();
                            $("#div_dt_mini_pgo" + param.gridId).show();
                        } else {
                            $("#" + param.gridId + "_previous").text(tp_common_qianyiye);
                            $("#" + param.gridId + "_next").text(tp_common_houyiye);
                            $("#" + param.gridId + "_length").show();
                            $("#" + param.gridId + "_info").show();
                            $("#div_dt_pgo" + param.gridId).show();
                            $("#div_dt_mini_pgo" + param.gridId).hide();
                        }
                    }
                    assertShowFoobar();
                    var resizeTimer = null;
                    $(window).bind('resize', function() {
                        if (resizeTimer) clearTimeout(resizeTimer);
                        resizeTimer = setTimeout(assertShowFoobar(), 500);
                    });
                }

                //琛屽彿
                if (param.showRowNumber == true) {
                    var api = this.api();
                    var startIndex = api.context[0]._iDisplayStart; //鑾峰彇鍒版湰椤靛紑濮嬬殑鏉℃暟
                    api.column(param.rowNumColumnIndex).nodes().each(function(cell, i) {
                        cell.innerHTML = (startIndex + i + 1);
                        //瑙ｅ喅涓插垪
                        $("#" + param.gridId + "_dt_row_num").css("width", cell.innerHTML.length);
                    });
                }
                //娓叉煋鍚庢墽琛岃嚜瀹氫箟鍥炶皟
                if (typeof param.drawCallback == "function") {
                    param.drawCallback(obj);
                }
            },
            aoColumnDefs: [{
                "bSortable": false,
                "aTargets": ['unsortable'] //鏍囬娣诲姞class:unsortable绂佺敤姝ゅ垪鎺掑簭鍔熻兘
            }],
            bAutoWidth: true, //鑷姩瀹藉害  
            errMode: "none",
            //Custom elements order ren.jq
            sDom: '<"top">rt<"bottom"lip><"clear">',
            oLanguage: dataTablesPage,
            sScrollX: true, //姝ゅ涓嶈兘涓虹┖ maqt
            sScrollXInner: "100%", //姝ゅ璁剧疆涓�110%涔嬪悗锛屾墍鏈夌殑Grid閮戒細鍑虹幇婊氬姩鏉★紝鏆傛椂璁剧疆涓虹┖
            bScrollCollapse: true,
            bStateSave: true,
            initComplete: function(settings, json) {
                if (typeof param.callback == "function") {
                    param.callback(settings, json);
                }
                //鍏ㄩ€夊姛鑳�
                $('#' + param.gridId + "_wrapper").find("input[name='check_all']").change(function() {
                    if ($(this).is(":checked")) {
                        $('#' + param.gridId + "_wrapper tr").each(function() {
                            $(this).find("td:first").find("input[type='checkbox']").prop('checked', 'checked');
                        });
                        $('#' + param.gridId + "_wrapper").find("tbody tr").addClass('active');
                    } else {
                        $('#' + param.gridId + "_wrapper tr").each(function() {
                            $(this).find("td:first").find("input[type='checkbox']").prop('checked', false);
                        });
                        $('#' + param.gridId + "_wrapper").find("tbody tr").removeClass('active');
                    }
                });
                //缈婚〉涔嬪悗灏嗗叏閫夊幓鎺�
                //		        	$('#'+param.gridId+"_paginate").on("click", "a", function() {
                //		                $('#'+param.gridId+"_wrapper").find("input[name='check_all']").prop('checked',false); 
                //		            });
            }
        }, param);
        //鍥哄畾鎿嶄綔鍒�-wenhm & ren.jq
        if (is_opt) {
            if ($(window).width() < 768) {} else {
                if (param.fixedColumns != "0") {
                    table = $.extend(table, {
                        fixedColumns: {
                            leftColumns: 0,
                            rightColumns: 1
                        }
                    })
                }
            }
        }
        //鍥哄畾鎿嶄綔鍒�-wenhm & ren.jq
        if (param.url) {
            var loading = "";
            //濡傛灉鍔犺浇鍚庡彴鏁版嵁
            table = $.extend(table, {
                serverSide: true,
                bServerSide: true,
                ajax: {
                    data: param.data || {},
                    url: param.url,
                    type: "POST",
                    dataSrc: "list",
                    dataType: "json",
                    contentType: 'application/json;charset=utf-8',
                    error: function(xhr, msg) {
                        layer.closeAll();
                        layer.msg(tp_common_requesterror);
                    },
                    beforeSend: function() {
                        if (param.loading) {
                            loading = Msg.load(); //鍙戦€佽姹備箣鍓嶆樉绀簂oading
                        }
                    },
                    complete: function(xhr, a, b) {
                        //姣忔閲嶆柊鍔犺浇涔嬪悗灏嗗叏閫夊幓鎺�
                        $('#' + param.gridId + "_wrapper").find("input[name='check_all']").prop('checked', false);

                        if (xhr.status == 403) {
                            Msg.info(tp_common_quan_xian_bu_zu, function() {
                                Util.load(contextpath + "/403");
                            });
                        }
                        if (loading) Msg.close(loading);
                        if (xhr.status == '0' && xhr.statusText == 'error') {
                            setTimeout("Msg.reloadPage()", 5000); //5绉掑悗鎻愮ず杩囨湡
                        }
                        //浠ヤ笅鏄湇鍔￠厤缃鐞嗙殑鎿嶄綔鎸夐挳锛岄紶鏍囨偓鍋滄椂寮瑰嚭涓嬫媺鎿嶄綔鑿滃崟鐨勯儴鍒嗭紝fp鐗规湁
                        //Util.swiperDbtn();
                        $(".hover-drop-btn").mouseover(function() {
                            $(this).parent(".hover-drop").addClass("open");
                            var optmun = $(this).parent().find("li").length;
                            var topD = $(this).offset().top;
                            var leftD = $(this).offset().left;
                            var bodyH = $('body').height();
                            var bodyW = $('body').width();
                            var dropH = optmun * 37
                            var dropbtnW = $(this).parent(".hover-drop").width();

                            $(this).parent(".hover-drop").find(".dropdown-menu.open").css("right", bodyW - leftD - dropbtnW - 20);
                            $(this).parent(".hover-drop").find(".dropdown-menu.open").css("left", "auto");
                            $(this).parent(".hover-drop").find(".dropdown-menu.open").css("position", "fixed");
                            $(this).parent(".hover-drop").find(".dropdown-menu.open").css("height", dropH);
                            $(this).parent(".hover-drop").find(".dropdown-menu.open").css("width", 160);
                            $(this).parent(".hover-drop").find(".dropdown-menu.open").css("min-width", 160);
                            if (dropH > bodyH - topD - 30) {
                                if (dropH > topD) {
                                    if (topD > bodyH - topD - 30) {

                                        $(this).parent(".hover-drop").find(".dropdown-menu.open").css("top", 10);
                                        $(this).parent(".hover-drop").find(".dropdown-menu.open").css("max-height", topD);
                                    } else {

                                        $(this).parent(".hover-drop").find(".dropdown-menu.open").css("top", topD + 30)
                                        $(this).parent(".hover-drop").find(".dropdown-menu.open").css("max-height", bodyH - top - 40);
                                    }
                                } else {

                                    $(this).parent(".hover-drop").find(".dropdown-menu.open").css("top", topD - dropH - 5);
                                }
                            } else {

                                $(this).parent(".hover-drop").find(".dropdown-menu.open").css("top", topD + 20);
                            }

                        });
                        $(".hover-drop-btn").mouseout(function() {
                            $(this).parent(".hover-drop").removeClass("open");
                        });
                    }
                }
            });
        } else if (param.localData) {
            //濡傛灉鍙姞杞芥湰鍦版暟鎹�
            table = $.extend(table, {
                serverSide: false,
                bServerSide: false,
                aaData: param.localData
            });
        }
        return $('#' + param.gridId).on('preInit.dt', function(e, settings, processing) {

        }).off('click').on('click', 'tr', function() {
            if ($(this).find("td").length == 1) {
                //濡傛灉鍙湁涓€鍒楋紝鍒欏彇娑堟帀閫変腑鏁堟灉(#37724鐐瑰嚮閿佸畾鐨勬搷浣滃垪涓嶆兂瑕侀€変腑鐨勬晥鏋�)
                return false;
            }
            if (param.selectedChange != false) {
                //濡傛灉娌℃湁鏄庣‘鎸囧畾锛屽垯杩涜鐐逛腑楂樹寒
                $(this).toggleClass('active');
                $(this).parents('#' + param.gridId + "_wrapper").find('div[class="DTFC_RightBodyLiner"]').find("tr[data-dt-row='" + (this.rowIndex - 1) + "']").toggleClass('active');
            }
            var checkbox = $(this).find(":checkbox");
            if (checkbox.length > 0) {
                checkbox = $(checkbox[0]);
                if (checkbox.is(":checked")) {
                    checkbox.prop('checked', false);
                } else {
                    checkbox.prop('checked', "checked");
                }
            }
            var radio = $(this).find(":radio");
            if (radio.length > 0 && radio.is(":checked")) {
                radio.prop('checked', false);
                $(this).removeClass('active');
            } else if (radio.length > 0) {
                radio.prop('checked', "checked");
                $(this).parent().find('tr').removeClass('active');
                $(this).addClass('active');
            }
        }).on('xhr.dt', function(e, settings, json, xhr) {
            //鍒ゆ柇鏄惁鏄剧ず鍒楄〃涓嬮潰鐨勫垎椤靛伐鍏锋爮
            if (json && json.size == 0) {
                $('#' + param.gridId + "_info").hide();
                $('#' + param.gridId + "_paginate").hide();
            } else {
                $('#' + param.gridId + "_info").show();
                $('#' + param.gridId + "_paginate").show();
            }
        }).DataTable(table);
    },
    /**
     * 娣诲姞鍜屼慨鏀圭殑form寮圭獥
     * @param setting
     */
    formModal: function(setting) {
        if (!setting.modalId) {
            if (window.console) {
                console.log('璇蜂紶閫掕modal 鍏冪礌 id 灞炴€�');
            }
            return;
        }
        //閫氳繃template灏唂orm妯℃澘娓叉煋鍒板叾瀹瑰櫒鍏冪礌(涓轰簡閬垮厤form鐨剅eset鏂规硶鏃犳晥)
        if (setting.templateId) {
            $("#" + setting.modalId).html(template(setting.templateId, setting.templateData));
            Util.initSysDic($("#" + setting.modalId).find("select")); //鍒濆鍖栧瓧鍏�
            Util.autocomplete($("#" + setting.modalId).find("input[autocomplete=true]")); //鍒濆鍖栬嚜鍔ㄥ～鍏�
            Util.autocomplete($("#" + setting.modalId).find("input[automatictp=true]")); //鍒濆鍖栬嚜鍔ㄥ～鍏�
            if (!$("#" + setting.modalId).find("select").is(":hidden")) {
                $("#" + setting.modalId).find("select").selectpicker('refresh'); //璋冪敤API 閲嶆柊娓叉煋
            }
        }
        //娓叉煋琛ㄥ崟鐨勫脊鍑虹獥
        $("#" + setting.modalId).unbind("show.bs.modal").on('show.bs.modal', function() {
            //濡傛灉绐楀彛宸茬粡鏄覆鏌撲箣鍚庣殑鍒欏埌姝ょ粓姝�
            if (!$("#" + setting.modalId).is(":hidden")) {
                return;
            }
            //娓叉煋涔嬪悗鍥炶皟
            if (typeof setting.render == "function") {
                setting.render();
            }
            if (!setting.formId) {
                if (window.console) {
                    console.log('璇蜂紶閫掕form 鍏冪礌 id 灞炴€�');
                }
                return;
            }
            //鑾峰彇 token
            Util.getToken(function(data) {
                $("#" + setting.formId).append("<input name='token' value='" + data + "' type='hidden'>");
            });
            if (!setting.NoKeyDown) {
                //鍥炶溅浜嬩欢formId
                $("#" + setting.formId).keydown(function(e) {
                    var e = e || event,
                        keycode = e.which || e.keyCode;
                    if (keycode == 13) {
                        $("#" + setting.submitBtn).trigger("click");
                    }
                });
            }
            //琛ㄥ崟鎻愪氦娣诲姞璁板綍
            $("#" + setting.submitBtn).unbind("click").click(function() {
                Util.addByForm({
                    formId: setting.formId, //琛ㄥ崟id
                    success: function(data) {
                        //闅愯棌琛ㄥ崟寮圭獥
                        $("#" + setting.modalId).modal('hide');
                        //鎴愬姛涔嬪悗鐨勫洖璋�
                        if (typeof setting.submit == "function") {
                            setting.submit(data);
                        }
                        //璇锋眰鎴愬姛涔嬪悗绉婚櫎绂佺敤灞炴€�
                        $("#" + setting.submitBtn).removeAttr("disabled");
                    },
                    validateRules: setting.validateRules,
                    submitBtn: setting.submitBtn
                });
            });
        }).modal({ backdrop: 'static', keyboard: false });
    },
    /**
     * des鍔犲瘑
     * @param data
     */
    desEnc: function(data) {
        return strEnc(data, 'tp', 'des', 'param');
    },
    /**
     * des瑙ｅ瘑
     * @param data
     */
    desDec: function(data) {
        return strDec(data, 'tp', 'des', 'param');
    },
    /**
     * 鍒濆鍖栨€у埆瀛楀吀涓嬫媺妗�
     * 濡傛灉 $select 涓嶄负绌猴紝鍒欏彧鍒濆鍖栧綋鍓嶈繖涓笅鎷夋
     */
    initSysDic: function($select) {
        $($select || $("select")).each(function(i, o) {
            //濡傛灉鏄殣钘忕殑鍒欑洿鎺ヨ繑鍥�
            if ($(this).is("hidden")) {
                return;
            } else if ($(this).attr("vtype") == 'def') {
                //鑷畾涔夌殑涓嬫媺鍒楄〃鏍囪锛屾棤闇€鍏叡鏂规硶杩涜select缁勪欢鐨勫垵濮嬪寲杩囩▼
                return;
            }
            var code = $(this).attr("code");
            //濡傛灉鏄病鏈塩ode鍒欑洿鎺ヨ繑鍥�
            if (!code) {
                return;
            }
            var value = $(this).attr("value");
            if ($(o).children().length == 0) {

                var defalutContent = $(this).attr("defalutContent");
                var multiple = $(this).attr("multiple");
                if (!multiple) {
                    if (Util.isNotEmpty(defalutContent)) {
                        $(o).append("<option value=''>" + defalutContent + "</option>");
                    } else {
                        $(o).append("<option value=''>璇烽€夋嫨</option>");
                    }
                }

                //濡傛灉椤甸潰涓婃病鏈夌紦瀛�
                if (!tp.dic.data[code]) {
                    $.ajax({
                        url: contextpath + "/sys/uacm/dicm/dic",
                        async: false,
                        type: "POST",
                        data: {
                            code: code
                        },
                        success: function(ret_dic) {
                            tp.dic.data[code] = ret_dic;
                            $.each(ret_dic, function(ii, oo) {
                                if (value == oo.CODEVALUE) {
                                    $(o).append("<option value='" + oo.CODEVALUE + "' selected='selected'  >" + tp.dic.language.get(oo.CODENAME) + "</option>");
                                } else {
                                    $(o).append("<option value='" + oo.CODEVALUE + "'>" + tp.dic.language.get(oo.CODENAME) + "</option>");
                                }
                            });
                            //濡傛灉涓嬫媺妗嗘敼鍙橈紝鍒欏幓鎺夐粯璁ゅ€�
                            $(o).change(function() {
                                $(o).removeAttr("value");
                            })
                            $(o).selectpicker("refresh");
                        },
                        error: function() {
                            if (window.console) {
                                console.log("鑾峰彇" + code + "瀛楀吀琛ㄥけ璐�");
                            }
                        }
                    });
                } else {
                    $.each(tp.dic.data[code], function(ii, oo) {
                        if (value == oo.CODEVALUE) {
                            $(o).append("<option value='" + oo.CODEVALUE + "' selected='selected'  >" + tp.dic.language.get(oo.CODENAME) + "</option>");
                        } else {
                            $(o).append("<option value='" + oo.CODEVALUE + "'>" + tp.dic.language.get(oo.CODENAME) + "</option>");
                        }
                    });
                    //濡傛灉涓嬫媺妗嗘敼鍙橈紝鍒欏幓鎺夐粯璁ゅ€�
                    $(o).change(function() {
                        $(o).removeAttr("value");
                    })
                    $(o).selectpicker("refresh");
                }
            }
        });
    },
    /**
     * 灏嗘€у埆key杞寲涓簐alue
     * @param key
     */
    convertSysDic: function(dic, key) {
        var value = "";
        //濡傛灉缂撳瓨涓笉瀛樺湪杩欎釜瀛楀吀琛�
        if (!tp.dic.data[dic]) {
            $.ajax({
                url: contextpath + "/sys/uacm/dicm/dic",
                async: false,
                type: "POST",
                data: {
                    code: dic
                },
                success: function(ret_dic) {
                    tp.dic.data[dic] = ret_dic;
                },
                error: function() {
                    if (window.console) console.log("鑾峰彇" + dic + "瀛楀吀琛ㄥけ璐�");
                }
            });
        }
        $(tp.dic.data[dic]).each(function(i, o) {
            if (o.CODEVALUE == key) {
                value = tp.dic.language.get(o.CODENAME);
            }
        });
        return value;
    },
    /**
     * 鏍规嵁閫楀彿鍒嗗壊锛屽皢key杞寲涓簐alue
     * @param key
     */
    convertSysDicSplitByComma: function(dic, key) {
        var value = "";
        $(tp.dic.data[dic]).each(function(i, o) {
            var keys = key.split(",");
            for (j = 0; j < keys.length; j++) {
                if (o.CODEVALUE == keys[j]) {
                    if (value == "") {
                        value = tp.dic.language.get(oo.CODENAME);
                    } else {
                        value = value + "," + tp.dic.language.get(o.CODENAME);
                    }
                }
            }
        });
        return value;
    },
    /**
     * 椤甸潰Tab鍒囨崲(pt:椤甸潰TAB灞曠ず锛沺tc椤甸潰TAB鍐呭;lp椤垫暟锛泃ype 绫诲瀷)
     * 鍚戞祻瑙堝櫒涓斁鍏ash鍊�
     */
    setHash: function(hash) {
        //鍒ゆ柇hash涓槸鍚︽湁go鐨勮烦杞�
        var act = this.getHash(location.hash, 'act');
        //濡傛灉浼犺繘鏉ョ殑hash涓病鏈夎烦杞湴鍧€锛屽垯榛樿鍔犱笂URL鍦板潃涓婇粯璁ょ殑
        if (hash.indexOf("act=") == -1 && act) {
            hash += "&act=" + act;
        }
        window.location.hash = hash;
    },
    /**
     * 鏇挎崲鎸囧畾hash鍊�
     */
    replaceHash: function(paramName, paramValue) {
        var hash = window.location.hash;
        for (var i = 0; i < arguments.length; i += 2) {
            paramName = arguments[i];
            paramValue = arguments[i + 1];
            var p = hash.match(new RegExp(paramName + "=([^\&]*)", "i"));
            if (p != null) {
                hash = hash.replace(p[0], paramName + "=" + paramValue);
            } else {
                var s = paramName + "=" + paramValue;
                if (hash.length > 0) {
                    hash += "&" + s;
                } else {
                    hash += s;
                }
            }
        }

        window.location.hash = hash;
    },
    /**
     * 鎴彇鍙傛暟鏂规硶锛宧ash锛氭埅鍙栫殑瀛楃涓诧紝name锛氭埅鍙栫殑鍙傛暟鍚嶏紝nvl锛氳鍙傛暟涓嶅瓨鍦ㄦ椂鐨勮繑鍥炲€�
     */
    //		getHash : function(hash,name,nvl){
    //			if(!nvl){
    //				nvl = "";
    //			}
    //			var svalue = hash.match(new RegExp("[\?\&]?" + name + "=([^\&\#]*)(\&?)", "i"));
    //			if(svalue == null){
    //				return nvl;
    //			}else{
    //				svalue = svalue ? svalue[1] : svalue;
    //				svalue = svalue.replace(/<script>/gi,"").replace(/<\/script>/gi,"").replace(/<html>/gi,"").replace(/<\/html>/gi,"").replace(/alert/gi,"").replace(/<span>/gi,"").replace(/<\/span>/gi,"").replace(/<div>/gi,"").replace(/<\/div>/gi,"");
    //				return decodeURIComponent(svalue);
    //			}
    //		},
    getHash: function(hash, name, nvl) {
        if (!nvl) {
            nvl = "";
        }
        var svalue = null;
        var val = (hash + "").split("#")[1];
        var arr = (val + "").split("&");
        $.each(arr, function() {
            var equalsindex = (this + "").indexOf("=");
            var ky = (this + "").substring(0, equalsindex);
            if (ky == name) {
                svalue = (this + "").substring(equalsindex + 1);
            }
        });
        if (svalue == null) {
            return nvl;
        } else {
            try {
                return decodeURIComponent(svalue);
            } catch (e) {
                return svalue;
            }
        }
    },
    /**
     * 鍒ゆ柇瀵硅薄鏄惁涓虹┖
     * 
     * @param {Object}
     *            v
     * @return {Boolean} 涓嶄负绌鸿繑鍥瀟rue锛屽惁鍒欒繑鍥瀎alse銆�
     */
    isNotEmpty: function(v) {
        if (typeof(v) == "object") {
            if ($.isEmptyObject(v)) {
                return false;
            } else {
                return true;
            }
        } else {
            if (v == null || typeof(v) == 'undefined' || v == "" || v == "unknown") {
                return false;
            } else {
                return true;
            }
        }
    },
    /**
     * 绌哄璞¤浆鎹�
     * 
     * @param {Object}
     *            v
     * @return {String} 涓嶄负绌鸿繑鍥炴湰韬紝鍚﹀垯杩斿洖"鏃�"銆�
     */
    nvlToStr: function(v) {
        if (v == null || typeof(v) == 'undefined' || v == "" || v == "unknown") {
            return "鏃�";
        } else {
            return v;
        }
    },
    /**
     * 绌哄璞¤浆鎹�
     * 
     * @param {Object}
     *            v
     * @return {String} 涓嶄负绌鸿繑鍥炴湰韬紝鍚﹀垯杩斿洖""銆�
     */
    nvlToNull: function(v) {
        if (v == null || typeof(v) == 'undefined' || v == "undefined" || v == "" || v == "unknown") {
            return "";
        } else {
            return v;
        }
    },
    /**
     * 
     * @param str 瀛楃涓�
     * @param num	淇濈暀闀垮害
     * @returns
     */
    subStr: function(str, length) {
        if (str && str.length > length) {
            return str.substring(0, length) + "...";
        }
        return str;
    },
    autocomplete: function(_this, config) {
        $(_this || $("input[autocomplete=true]") || $("input[automatictp=true]")).each(function(i, o) {
            $(o).autocomplete($.extend({
                items: $(o).attr("items") || 20,
                source: function(query, process) {
                    var name = $(o).attr("name");
                    var mapping = $(o).attr("mapping");
                    var sql = $(o).attr("sql");
                    var param = {};
                    param[name] = query;
                    param['mapping'] = mapping;
                    if (sql) {
                        param['sql'] = sql;
                    }
                    Util.ajax({
                        param: param,
                        url: $(o).attr("action"),
                        success: function(data) {
                            Util.changeAutocompletePosition(o);
                            //閲嶆柊鍙戦€佽姹備箣鍚庢竻绌簐alue鍊�
                            $("input[name='" + name + "']").change(function() {
                                $("input[name='" + name + "_code']").val('');
                            });
                            return process(data);
                        }
                    });
                },
                formatItem: function(item) {
                    var mapping = $(o).attr("mapping");
                    var hidecode = $(o).attr("hidecode");
                    if (mapping == "getUserForAutocomplete") {
                        return item["VALUE"] + " - (" + Util.convertSysDic("DICT_COMM_GENDER", item["USER_SEX"]) + "," + item["UNIT_NAME"] + ")";
                    } else if (hidecode == true || hidecode == "true") {
                        return item["VALUE"];
                    } else {
                        return item["VALUE"] + " - " + item["CODE"];
                    }
                },
                setValue: function(item) {
                    var mapping = $(o).attr("mapping");
                    var reg = new RegExp("^getUumUnitNameList");
                    var reg2 = new RegExp("^getUgmUnitNameList");
                    if ((reg.test(mapping) || reg2.test(mapping)) && item["TYPE"] == "1") {
                        return { 'data-value': item["VALUE2"] + "-" + item["VALUE"], 'real-value': item["UNIONCODE"] };
                    } else {
                        return { 'data-value': item["VALUE"], 'real-value': item["CODE"] };
                    }
                }
            }, config));
        });
    },
    changeAutocompletePosition: function(o) {
        var ondiv_flag = 0;
        $(o).parent().mouseover(function() {
            ondiv_flag = 1;
        });
        $(o).parent().mouseout(function() {
            ondiv_flag = 0;
        })
        var X = Math.ceil($(o).offset().top + $(o).height());
        var Y = Math.ceil($(o).offset().left);
        var bodyH = $('body').height();
        var tH = X - 20;
        var bH = bodyH - X - 50;
        var auto_ul;
        setTimeout(function() {
            auto_ul = $(o).parent().find("ul");
            if (auto_ul.length > 0) {
                var optmun = $(o).parent().find("li");
                var dropdownH = optmun.length * 37 + 3;
                if (dropdownH < bH) {
                    if (bH < 160) {

                        auto_ul.css("max-height", tH);
                        auto_ul.css("min-height", 37);
                        auto_ul.css("top", X - dropdownH - 40);
                    } else {
                        auto_ul.css("max-height", bH);
                        auto_ul.css("min-height", 37);
                        auto_ul.css("top", X + 5);
                    }
                } else {
                    if (dropdownH < tH) {
                        auto_ul.css("max-height", tH);
                        auto_ul.css("min-height", 37);
                        auto_ul.css("top", X - dropdownH - 40);
                    } else {
                        if (bH > tH) {
                            auto_ul.css("max-height", bH);
                            auto_ul.css("min-height", 37);
                            auto_ul.css("top", X + 25);

                        } else {
                            auto_ul.css("max-height", tH);
                            auto_ul.css("min-height", 37);
                            auto_ul.css("top", X - tH - 10);
                        }
                    }
                }
                auto_ul.animate({ scrollTop: 0 }, 0);
                auto_ul.css("height", dropdownH);
                auto_ul.css("left", Y + "px");
                auto_ul.css("min-width", $(o).outerWidth());
                auto_ul.css("width", $(o).outerWidth());
                auto_ul.css("position", "fixed");
            }
            if (document.addEventListener) {
                document.addEventListener('DOMMouseScroll', function(e) {
                    var direct = 0;
                    e = e || window.event;
                    if (e.wheelDelta) { //IE/Opera/Chrome
                        direct = e.wheelDelta;
                    } else if (e.detail) { //Firefox
                        direct = e.detail;
                    }
                    if (typeof(auto_ul) != "undefined" && auto_ul.length > 0) {
                        var scrollheight = auto_ul[0].scrollHeight - auto_ul[0].scrollTop - auto_ul[0].clientHeight;
                        if (ondiv_flag == 0 && direct != 0) {
                            $(o).parent().find("ul").css("display", "none");
                        } else if (auto_ul.scrollTop() == 0 && direct < 0 && ondiv_flag == 1) {
                            e.preventDefault();
                        } else if (scrollheight == 0 && direct > 0 && ondiv_flag == 1) {
                            e.preventDefault();
                        }
                    }
                }, false);
            }
            window.onmousewheel = document.onmousewheel = function(e) {
                var direct = 0;
                e = e || window.event;
                if (e.wheelDelta) { //IE/Opera/Chrome
                    direct = e.wheelDelta;
                } else if (e.detail) { //Firefox
                    direct = e.detail;
                }
                if (typeof(auto_ul) != "undefined") {
                    var scrollheight = auto_ul[0].scrollHeight - auto_ul[0].scrollTop - auto_ul[0].clientHeight;
                    if (ondiv_flag == 0 && direct != 0) {
                        $(o).parent().find("ul").css("display", "none");
                    } else if (auto_ul.scrollTop() == 0 && direct > 0 && ondiv_flag == 1) {
                        e.preventDefault();
                    } else if (scrollheight == 0 && direct < 0 && ondiv_flag == 1) {
                        e.preventDefault();
                    }
                }
            }; //IE/Opera/Chrome
        }, 10);
        $(o).unbind("keydown").keydown(function() {
            $(this).parent().find("ul").css("display", "none");
            auto_ul.css("position", "absolute");
        });
    },
    summernote: function(config) {
        $.ajax({
            url: 'https://api.github.com/emojis'
        }).then(function(data) {
            window.emojis = Object.keys(data);
            window.emojiUrls = data;
        });

        if (!config.id) {
            if (window.console) {
                console.log('璇蜂紶閫� summernote id 灞炴€�');
            }
            return;
        }
        $("#" + config.id).summernote($.extend({
            lang: 'zh-CN',
            height: 300,
            callbacks: {
                /*onImageUpload: function(files) {
                	data = new FormData();
                    data.append("file", files[0]);
                    $.ajax({
                        data: data,
                        type: "POST",
                        url: contextpath + '/upload/'+config.module||summernote,
                        cache: false,
                        contentType: false,
                        processData: false,
                        success: function(data) {
                        	$("#"+config.id).summernote('insertImage', contextpath + "/" + data.path, 'image name'); 
                        }
                    });
                }*/
            },
            fontNames: ["Arial", "Arial Black", "Comic Sans MS",
                "Courier New", "Helvetica Neue", "Helvetica", "Impact",
                "Lucida Grande", "Tahoma", "Times New Roman", "Verdana", "寰蒋闆呴粦", "榛戜綋", "瀹嬩綋", "浠垮畫", "妤蜂綋"
            ],
            hint: {
                match: /:([\-+\w]+)$/,
                search: function(keyword, callback) {
                    callback($.grep(emojis, function(item) {
                        return item.indexOf(keyword) === 0;
                    }));
                },
                template: function(item) {
                    var content = emojiUrls[item];
                    return '<img src="' + content + '" width="20" /> :' + item + ':';
                },
                content: function(item) {
                    var url = emojiUrls[item];
                    if (url) {
                        return $('<img />').attr('src', url).css('width', 20)[0];
                    }
                    return '';
                }
            }
        }, config));
    },
    tree: function(settings, data) {
        if (!settings.treeId) {
            if (window.console) {
                console.log('璇蜂紶閫� tree Id');
            }
            return;
        }

        var enable_edit = settings.allowEdit != undefined ? settings.allowEdit : true;

        var setting = {
            async: {
                enable: !data,
                autoParam: settings.autoParam || ["id"],
                url: settings.url
            },
            check: {
                enable: true
            },
            edit: {
                enable: enable_edit,
                renameTitle: "閲嶅懡鍚�",
                removeTitle: "鍒犻櫎鑺傜偣"
            },
            data: {
                simpleData: {
                    enable: data,
                    idKey: settings.idKey || "id",
                    pIdKey: settings.pIdKey || "pId"
                },
                key: {
                    name: settings.name || "name"
                }
            },
            view: {
                addHoverDom: function addHoverDom(treeId, treeNode) {
                    if (enable_edit) {
                        var sObj = $("#" + treeNode.tId + "_span");
                        if (treeNode.editNameFlag || $("#addBtn_" + treeNode.tId).length > 0) return;
                        var addStr = "<span class='button add' id='addBtn_" + treeNode.tId +
                            "' title='娣诲姞鑺傜偣' onfocus='this.blur();'></span>";
                        sObj.after(addStr);
                        var btn = $("#addBtn_" + treeNode.tId);
                        if (btn) btn.bind("click", function() {
                            if (settings.add && typeof settings.add == 'function') {
                                settings.add(treeId, treeNode);
                            } else {
                                if (window.console) {
                                    console.log('灏氭湭浼犻€掓坊鍔犵殑鍥炶皟鏂规硶');
                                }
                            }
                        });
                    }
                },
                removeHoverDom: function removeHoverDom(treeId, treeNode) {
                    if (enable_edit)
                        $("#addBtn_" + treeNode.tId).unbind().remove();
                }
            },
            callback: {
                beforeRemove: function(treeId, treeNode) {
                    Msg.confirm("纭鍒犻櫎璇ヨ妭鐐广€�", function() {
                        if (settings.remove && typeof settings.remove == 'function') {
                            //濡傛灉鍥炶皟鏂规硶杩斿洖鍊间负true锛屽垯鍒犻櫎鑺傜偣
                            if (settings.remove(treeId, treeNode)) {
                                $.fn.zTree.getZTreeObj(treeId).selectNode(treeNode);
                            }
                        } else {
                            if (window.console) {
                                console.log('灏氭湭浼犻€掑垹闄ょ殑鍥炶皟鏂规硶');
                            }
                            return false;
                        }
                    });
                    return false;
                },
                beforeRename: function(treeId, treeNode, newName) {
                    if (newName.length == 0) {
                        Msg.warning("鑺傜偣鍚嶇О涓嶈兘涓虹┖銆�");
                        return false;
                    }
                    if (settings.rename && typeof settings.rename == 'function') {
                        return settings.rename(treeId, treeNode, newName);
                    } else {
                        if (window.console) {
                            console.log('灏氭湭浼犻€掍慨鏀瑰悕绉扮殑鍥炶皟鏂规硶');
                        }
                        return true;
                    }
                },
                onCheck: function(event, treeId, treeNode) {
                    $.fn.zTree.getZTreeObj(treeId).selectNode(treeNode);
                    if (settings.checked && typeof settings.checked == 'function') {
                        return settings.checked(event, treeId, treeNode);
                    }
                },
                onClick: function(event, treeId, treeNode) {
                    if (!treeNode.checked) {
                        $.fn.zTree.getZTreeObj(treeId).checkNode(treeNode);
                    }
                    if (settings.click && typeof settings.click == 'function') {
                        return settings.click(event, treeId, treeNode);
                    }
                }
            }
        }
        if (data) {
            return $.fn.zTree.init($("#" + settings.treeId), $.extend(setting, settings), data);
        }
        return $.fn.zTree.init($("#" + settings.treeId), $.extend(setting, settings));
    },
    setCookie: function setCookie(name, value, expiredays) {
        var exdate = new Date()
        exdate.setDate(exdate.getDate() + expiredays)
        document.cookie = name + "=" + escape(value) + ((expiredays == null) ? "" : ";expires=" + exdate.toGMTString())
    },
    getCookie: function getCookie(name) {
        if (document.cookie.length > 0) {
            c_start = document.cookie.indexOf(name + "=")
            if (c_start != -1) {
                c_start = c_start + name.length + 1
                c_end = document.cookie.indexOf(";", c_start)
                if (c_end == -1) c_end = document.cookie.length
                return unescape(document.cookie.substring(c_start, c_end))
            }
        }
        return ""
    },
    checkServiceLimit: function(serviceID) {
        var result = true;
        Util.ajax({
            url: contextpath + "/fp/serveapply/checkLimit",
            dataType: "text",
            async: false,
            param: { serviceID: serviceID },
            method: "POST",
            success: function(data) {
                if (data !== "OK") { //杈惧埌鐢宠涓婇檺锛屼笉鍏佽鐢宠
                    layer.msg("鏈嶅姟鐢宠宸茶揪涓婇檺锛屼笉鍙啀娆＄敵璇凤紒", {
                        time: 2000 //2s鍚庤嚜鍔ㄥ叧闂�
                    });
                    result = false;
                }
            }
        });
        return result;
    },
    //鏍￠獙鏈嶅姟鏄惁宸茬粡瀹℃牳瀹屾垚
    checkServiceOver: function(serviceID) {
        var result = true;
        Util.ajax({
            url: contextpath + "/fp/serveapply/checkOver",
            dataType: "text",
            async: false,
            param: { serviceID: serviceID },
            method: "POST",
            success: function(data) {
                if (data !== "OK") { //杈惧埌鐢宠涓婇檺锛屼笉鍏佽鐢宠
                    layer.msg("涓婁竴鏈堝～鎶ヨ繕娌℃湁濉姤鎴栨病鏈夊鏍稿畬鎴愶紝闇€瑕佸厛濉姤涓婁竴娆＄敵璇凤紒", {
                        time: 2000 //2s鍚庤嚜鍔ㄥ叧闂�
                    });
                    result = false;
                }
            }
        });
        return result;
    },
    //Tab鐨勬粦鍔ㄥ姛鑳�
    swiperTab: function() {
        var swiper = new Swiper('.swiper-container', {
            pagination: null,
            slidesPerView: 'auto',
            paginationClickable: true,
            spaceBetween: 0,
            freeMode: true,
            resistanceRatio: 0.5
        });
    },
    //Tab鐨勬粦鍔ㄥ姛鑳�
    /*Btn鐨勬粦鍔ㄥ姛鑳�
		swiperBtn:function(){
			var swiper = new Swiper('.swiper-container-btn', {
			    pagination: '.swiper-pagination',
			    slidesPerView: 'auto',
			    paginationClickable: true,
			    spaceBetween: 0,
			    freeMode: true,
			    resistanceRatio: 0.5
	
			});
		}
		//Btn鐨勬粦鍔ㄥ姛鑳�*/
    //Btn鐨勬粦鍔ㄥ姛鑳�-ren.jq-START
    swiperBtn: function() {
        var swiper = new Swiper('.swiper-container-btn', {
            slidesPerView: 'auto',
            paginationClickable: true,
            spaceBetween: 0,
            freeMode: true,
            resistanceRatio: 0.5,
            on: {
                resize: function() {
                    setTimeout("swiper.update()", 1000)

                }
            }
        });

        //婊戝姩鍔熻兘鎻愮ず妗�-ren.jq-START
        $("<div class='swiper-note' style='z-index: 999;'>" +
            "<span class='fa fa-hand-o-up'></span>鎸夐挳鏄彲浠ユ粦鍔ㄧ殑鍝︼紒锛侊紒<button type='button' class='close' data-dismiss='alert'><span aria-hidden='true'>脳</span><span class='sr-only'>Close</span></button>" +
            "</div>").appendTo(".swiper-btngroup:first-child")

        function swipernote() {
            var w = 0
            $(".swiper-btngroup").each(function() {
                var d = $(this).find(".link_btn").length
                $(this).find(".link_btn").each(function() {
                    w += parseInt($(this).width());
                })
                var p = $(".swiper-btngroup").width();
                if ((w + d * 30) > p) {
                    $(this).find(".swiper-note").addClass("active");
                    $(this).find(".swiper-container-btn").width("98%");
                } else {
                    $(this).find(".swiper-container-btn").width("auto");
                }
            })
            var t = setTimeout('$(".swiper-note").removeClass("active")', 11000);
        };
        swipernote();
        $(window).resize(function() {
            swipernote();
            swiper.update();
        });
        //婊戝姩鍔熻兘鎻愮ず妗�-ren.jq-END
    },
    //Btn鐨勬粦鍔ㄥ姛鑳�-ren.jq-END
    slFoldable: function() {
            //ren.jq-鍒ゆ柇澶氱淮搴﹀垎绫讳綍鏃朵竴琛屾樉绀轰笉涓嬫墍鏈夊垎绫婚渶瑕佹姌鍙犱笌灞曞紑
            $(".select-line-foldable .fold-btn").unbind("click").on("click", function(e) {
                $(this).closest(".select-line-foldable").toggleClass("active");
                if ($(this).closest(".select-line-foldable").hasClass("active")) {
                    $(this).removeClass("fa fa-caret-down");
                    $(this).addClass("fa fa-caret-up");
                } else {
                    $(this).removeClass("fa fa-caret-up");
                    $(this).addClass("fa fa-caret-down");
                }
            });
            var selectfoldable = function(a) {
                $(".select-line-foldable").each(function() {
                    var d = $(this).find("span").length
                    var b = $(this).find("a").length
                    var p = $(this).children("div").width();
                    var w = 0
                    $(this).children("div").find("a").each(function() {
                        w += parseInt($(this).width());
                    })
                    if ((w + 11 * d + 12 * b) < p) {
                        $(this).children(".fold-btn").hide();

                    } else {
                        $(this).children(".fold-btn").show();
                    }
                });
            };
            selectfoldable();
            $(window).resize(function() {
                selectfoldable();
            });
        }
        //ren.jq
        //Btn鐨勬粦鍔ㄥ姛鑳�-ren.jq-END
        /**
         * 瑁佸壀鍥剧墖
         * @param cb 鍥炶皟鍑芥暟
         * @param module 妯″潡鐨勫悕瀛�
         * @param type 1锛氬帇缂╋紱2锛氳鍓�
         * @param path 鍥剧墖璺緞
         * @param width	瀹藉害
         * @param height	楂樺害
         * @param x	X杞�
         * @param y	Y杞�
         */
        ,
    crop: function(cb, module, type, path, width, height, x, y, rotate) {
        $.post(contextpath + "/crop/" + module, {
            type: type || 1,
            path: path,
            width: width,
            height: height,
            x: x || 0,
            y: y || 0,
            rotate: rotate || 0
        }, function(data) {
            if (typeof cb == 'function') {
                cb(data);
            }
        });
    },
    //IP杞垚鏁村瀷  
    ip2int: function(ip) {
        var num = 0;
        ip = ip.split(".");
        num = Number(ip[0]) * 256 * 256 * 256 + Number(ip[1]) * 256 * 256 + Number(ip[2]) * 256 + Number(ip[3]);
        num = num >>> 0;
        return num;
    },
    //鏁村瀷瑙ｆ瀽涓篒P鍦板潃  
    int2iP: function(num) {
        //濡傛灉鏄疘Pv6
        if ((num + '').indexOf(':') != -1) {
            return num;
        }
        var str;
        var tt = new Array();
        tt[0] = (num >>> 24) >>> 0;
        tt[1] = ((num << 8) >>> 24) >>> 0;
        tt[2] = (num << 16) >>> 24;
        tt[3] = (num << 24) >>> 24;
        str = String(tt[0]) + "." + String(tt[1]) + "." + String(tt[2]) + "." + String(tt[3]);
        return str;
    },
    isIE: function() {
        if (!!window.ActiveXObject || "ActiveXObject" in window)
            return true;
        else
            return false;
    },
    getChkColumn: function() {
        if (Util.isIE()) {
            return "<input onclick='this.checked = !this.checked' ondblclick='this.checked = !this.checked' type='checkbox'>";;
        } else {
            return "<input onclick='this.checked = !this.checked' type='checkbox'>";;
        }
    },
    //瑙ｇ爜html
    htmlDecode: function(value) {
        if (value == null || value == "") {
            return "";
        }
        return $('<div/>').html(value).text();
    },
    htmlEncode: function(str) {
        if (str == null || str == "") {
            return "";
        }
        return $('<div/>').text(str).html();
    },
    removeHtmlTab: function(tab) {
        if (tab == null) {
            return "";
        } else {
            return tab.replace(/<[^<>]+?>/g, ''); //鍒犻櫎鎵€鏈塇TML鏍囩
        }
    },
    //璇诲彇json鏁版嵁
    getJsonContent: function(url, callback, error) {
        $.ajax({
            type: "get",
            async: true,
            url: contextpath + "/" + url,
            dataType: "jsonp",
            jsonp: "callback", //浼犻€掔粰璇锋眰澶勭悊绋嬪簭鎴栭〉闈㈢殑锛岀敤浠ヨ幏寰梛sonp鍥炶皟鍑芥暟鍚嶇殑鍙傛暟鍚�(涓€鑸粯璁や负:callback)
            jsonpCallback: "jsonp_" + url.substring(url.lastIndexOf('/') + 1, url.indexOf('.json')), //鑷畾涔夌殑jsonp鍥炶皟鍑芥暟鍚嶇О锛岄粯璁や负jQuery鑷姩鐢熸垚鐨勯殢鏈哄嚱鏁板悕锛屼篃鍙互鍐�"?"锛宩Query浼氳嚜鍔ㄤ负浣犲鐞嗘暟鎹�
            success: function(json) {
                if (typeof(callback) == "function") {
                    callback(json.result);
                }
            },
            error: function() {
                Msg.error("鏈煡璇㈠埌鐩稿叧鍐呭锛岃鑱旂郴绠＄悊鍛�");
                if (typeof(error) == "function") {
                    error();
                }
            }
        });
    },
    //杩斿洖璺宠浆椤甸潰
    moduleJumpCcancle: function() {
        var cpparams = Util.getHash(location.hash, "cpparams", "");
        if (cpparams == "") {
            Util.setHash("#p=");
        } else {
            cpparams = template.BASE64.decode(cpparams);
            cpparams = JSON.parse(cpparams);
            var parentp = Util.getHash(cpparams.parenthash, "p", "");
            //鍥犱负鏄唴閮ㄨ烦杞琣ct娌℃湁鏀瑰彉
            var act = Util.getHash(location.hash, "act", "");
            var gobackact = cpparams.gobackact;
            if (!Util.isNotEmpty(gobackact)) {
                gobackact = act;
            }
            Util.run = null;
            $(window).unbind("hashchange");
            //parentp濡傛灉涓虹┖锛岃鏄庣埗椤甸潰鏄垪琛ㄩ〉闈紝鍦ㄨ烦杞悗setHash锛屽鏋滀笉涓虹┖锛岃鏄庣埗椤甸潰鏄〃鍗曢〉闈紝鍦╨oad涓璼etHash
            $("#page-content").load(gobackact, function() {
                //杩斿洖琛ㄥ崟
                if (gobackact.indexOf("cp/templateList/p") < 0 || (gobackact.indexOf("cp/templateList/p") > -1 && (Util.isNotEmpty(parentp)))) {
                    if (Util.run && typeof Util.run == 'function') Util.run('form');
                    Util.setHash(cpparams.parenthash);
                } else {
                    //杩斿洖鍒楄〃
                    if (Util.run && typeof Util.run == 'function') Util.run();
                }
            });
            //杩斿洖鍒楄〃
            if (gobackact.indexOf("cp/templateList/p") > -1 && !Util.isNotEmpty(parentp)) {
                Util.setHash(cpparams.parenthash);
            }
        }
    },
    isChinese: function(str) {
        var reg = /^[A-Za-z0-9_-]+$/;
        return !reg.test(str);
    }
}

/**
 * 鑷畾涔夋柟娉曡artTemplate寮曠敤锛屽鏃ユ湡鏍煎紡鍖�
 */
template.helper('dateFormat', function(date, format) {
    if (!date) {
        return;
    }
    date = new Date(date);
    var map = {
        "M": date.getMonth() + 1, //鏈堜唤 
        "d": date.getDate(), //鏃� 
        "h": date.getHours(), //灏忔椂 
        "m": date.getMinutes(), //鍒� 
        "s": date.getSeconds(), //绉� 
        "q": Math.floor((date.getMonth() + 3) / 3), //瀛ｅ害 
        "S": date.getMilliseconds() //姣 
    };
    format = format.replace(/([yMdhmsqS])+/g, function(all, t) {
        var v = map[t];
        if (v !== undefined) {
            if (all.length > 1) {
                v = '0' + v;
                v = v.substr(v.length - 2);
            }
            return v;
        } else if (t === 'y') {
            return (date.getFullYear() + '').substr(4 - all.length);
        }
        return all;
    });
    return format;
});

/**
 * 瀛楀吀杞崲
 */
template.helper('convertSysDic', function(dic, data) {
    if (!data || !dic) return;
    return Util.convertSysDic(dic, data);
});
/**
 * 瀛楀吀杞崲鏍规嵁閫楀彿
 */
template.helper('convertSysDicSplitByComma', function(dic, data) {
    if (!data || !dic) return;
    return Util.convertSysDicSplitByComma(dic, data);
});
/**
 * IP杞崲
 */
template.helper('int2iP', function(data) {
    return Util.int2iP(data);
});

/**
 * 鎴彇瀛楃涓�
 */
template.helper('subStr', function(str, length) {
    return Util.subStr(str, length);
});

var Msg = {
    /**
     * 鎿嶄綔鎴愬姛鎻愮ず
     * @param m
     */
    success: function(m) {
        layer.msg(Util.htmlEncode(m) || tp_common_success, {
            icon: 1,
            time: 2000 //2s鍚庤嚜鍔ㄥ叧闂�
        });
    },
    /**
     * 鎿嶄綔澶辫触鎻愮ず
     * @param m
     */
    error: function(m) {
        layer.msg(Util.htmlEncode(m) || tp_common_fail, {
            icon: 11,
            time: 2000 //2s鍚庤嚜鍔ㄥ叧闂�
        });
    },
    /**
     * 璀︾ず
     * @param m
     */
    warning: function(m, callback, callback1) {
        //			layer.alert(m, {
        //			  title: '绯荤粺鎻愮ず',
        //			  icon: 0
        //			},function(index){
        //				layer.close(index);
        //				if(typeof callback == "function"){
        //					callback();
        //				}
        //			});
        var layerObj = layer.confirm(Util.htmlEncode(m), {
            title: tp_common_warning,
            btn: [tp_common_confirm, tp_common_cancel]
        }, function() {
            layer.close(layerObj);
            if (typeof callback == "function") {
                callback();
            }
        }, function() {
            layer.close(layerObj);
            if (typeof callback1 == "function") {
                callback1();
            }
        });
    },
    /**
     * 鎻愮ず
     * @param m
     */
    info: function(m, callback, callback1) {
        //			layer.alert(m, {
        //			  title: '绯荤粺鎻愮ず',
        //			  icon: 5
        //			});
        var layerObj = layer.confirm(Util.htmlEncode(m), {
            title: tp_common_warning,
            btn: [tp_common_confirm, tp_common_cancel]
        }, function() {
            layer.close(layerObj);
            if (typeof callback == "function") {
                callback();
            }
        }, function() {
            layer.close(layerObj);
            if (typeof callback1 == "function") {
                callback1();
            }
        });
    },
    /**
     * 纭
     * @param m
     */
    confirm: function(m, callback, callback1) {
        var layerObj = layer.confirm(Util.htmlEncode(m), {
            title: tp_common_warning,
            btn: [tp_common_confirm, tp_common_cancel]
        }, function() {
            layer.close(layerObj);
            if (typeof callback == "function") {
                callback();
            }
        }, function() {
            layer.close(layerObj);
            if (typeof callback1 == "function") {
                callback1();
            }
        });
    },
    prompt: function(param) {
        var obj = $.extend({
            formType: 2,
            title: tp_common_warning
        }, param);
        var index = layer.prompt(obj, function(value, index, elem) {
            if ($.isFunction(param.callback)) {
                param.callback(value, index, elem);
            }
            layer.close(index);
        });
    },
    /**
     * 鍔犺浇
     * @param m
     */
    load: function(config) {
        //濡傛灉鍔犺浇灞傚瓨鍦ㄥ垯涓嶉渶瑕佸啀娆″垱寤�
        if ($("div[type='loading']").length == 0) {
            return layer.load(1, $.extend({
                time: 60000, //60绉掑悗榛樿鍏抽棴
                shade: [0.1, '#000'], //0.1閫忔槑搴︾殑鐧借壊鑳屾櫙
                content: '<div class="exam-loader-centerbox"><div class="loader"><div class="loader-inner line-scale"><div></div><div></div><div></div><div></div><div></div></div></div><div class="exam-loader-text">' + tp_common_loading + '</div></div>'
            }, config));
        }
    },
    /**
     * 鍏抽棴
     * 浼犲叆鐨刼bj涓虹┖鏃跺叧闂墍鏈夊眰锛�
     * 浼犲叆鐨刼bj='dialog' 鍏抽棴淇℃伅妗�
     * 浼犲叆鐨刼bj='page' 鍏抽棴鎵€鏈夐〉闈㈠眰
     * 浼犲叆鐨刼bj='iframe' 鍏抽棴鎵€鏈夌殑iframe灞�
     * 浼犲叆鐨刼bj='loading' 鍏抽棴鍔犺浇灞�
     * 浼犲叆鐨刼bj='tips' 鍏抽棴鎵€鏈夌殑tips灞� 
     * @param m
     */
    close: function(obj) {
        if (Util.isNotEmpty(obj)) {
            layer.close(obj);
        } else {
            layer.closeAll();
        }
    },
    /**
     * 寮瑰嚭鏄剧ず椤甸潰灞�
     * @param setting
     */
    open: function(setting) {
        if (!setting.title) { //title涓嶈缃粯璁や笉鏄剧ずtitle
            setting.title = false;
        }
        //閫氳繃template灏唄tml妯℃澘娓叉煋鍒板叾瀹瑰櫒鍏冪礌
        if (setting.templateId) {
            //				if(!setting.contentId){
            //					if(window.console){
            //						console.log('璇蜂紶閫� contentId灞炴€�');
            //					}
            //					return;
            //				}
            var containerId = setting.contentId;
            if (setting.containerId) {
                containerId = setting.containerId;
            }
            $("#" + containerId).html(template(setting.templateId, { 'data': setting.templateData }));
        }
        layer.open($.extend({
            type: 1,
            anim: -1,
            area: setting.area, //瀹介珮['500px', '300px']
            skin: 'layui-layer-rim', //鍔犱笂杈规
            title: setting.title, //鍙互浼犳櫘閫氱殑瀛楃涓诧紝濡傛灉浣犱笉鎯虫樉绀烘爣棰樻爮浼爁alse
            content: $("#" + setting.contentId),
            end: function() {
                if (setting.contentId) {
                    $("#" + setting.contentId).hide();
                } else {
                    $(setting.content).hide();
                }
            },
        }, setting));
    },
    reloadPage: function() {
        //鎻愮ず妗嗗彧寮瑰嚭涓€娆�
        if ($("#sessionTimeut_reloadPage").length != 0) return;
        //濡傛灉娴忚鍣ㄧ獥鍙ｅ灏忎簬寮圭獥鐨勫锛屽垯鐩存帴鍒锋柊锛屼笉鍋氭彁绀�
        if ($(window).width() < 700) {
            location.reload();
            return;
        }
        //濡傛灉鏈� abort 鐨勮姹傝繘鍏ュ埌杩欓噷锛屽垯鍐嶆閲嶈瘯3閬嶏紝濡傛灉渚濇棫 abort 鍒欎换鍔ession涓簡
        var sessionTimeout = 0;
        for (var i = 0; i < 3; i++) {
            $.ajax({
                url: contextpath + "/ping",
                async: false,
                complete: function(xhr) {
                    if (xhr.status == '0' && xhr.statusText && xhr.statusText.toLowerCase().indexOf('error') != -1) {
                        ++sessionTimeout;
                    }
                }
            });
        }
        if (sessionTimeout != 3) {
            return;
        }

        var dialog = '<div  class="pull-left">' +
            '			<div class="modal-dialog modal-lg push-up-0 push-down-0 push-left-0 push-right-0" style="max-width:570px;">' +
            '		<div class="modal-content modal-content-noborder">' +
            '			<div class="modal-header">' +
            //			'				<button id="uam_pop_close" type="button" class="close" data-dismiss="modal">' +
            //			'					<span aria-hidden="true">脳</span><span class="sr-only">Close</span>' +
            //			'				</button>' +
            '				<h4 class="modal-title">鐧诲綍鐘舵€佽繃鏈�</h4>' +
            '			</div>' +
            '			<div class="modal-body">' +
            '				<div class="prompt-contant push-up-0">' +
            '					<div class="prompt-img">' +
            '						<img src="' + contextpath + '/resource/image/common/refresh_prompt.png" alt="" class="bar">' +
            '					</div>' +
            '					<div class="prompt-text">' +
            '						<p class="prompt-text-title">鐧诲綍鐘舵€佽繃鏈�</p>' +
            '						<p class="prompt-text-info">鎮ㄧ殑鐧诲綍鐘舵€佸彲鑳藉凡缁忚繃鏈燂紝鐐瑰嚮纭畾绔嬪嵆鍒锋柊褰撳墠椤甸潰锛�<span id="alert_time_out_second_span" style="color:red;">30</span>绉掑悗鑷姩鍒锋柊銆�</p>' +
            '					</div>' +
            '					<div class="clear"></div>' +
            '				</div>' +
            '			</div>' +
            '			<div class="modal-footer">' +
            '				<button type="button" id="sessionTimeut_reloadPage" class="btn btn-primary pull-right" style="background-color:#263339;border-color:#263339;">纭畾</button>' +
            '			</div>' +
            '		</div>' +
            '	</div>' +
            '</div>';
        layer.open({
            type: 1,
            shade: false,
            closeBtn: 0,
            area: '580px',
            title: false, //涓嶆樉绀烘爣棰�
            content: dialog,
            success: function() {
                $("#sessionTimeut_reloadPage").click(function() {
                    location.reload();
                });
                var interval = setInterval(function() {
                    var val = $("#alert_time_out_second_span").text() * 1 - 1;
                    if (val == 0) {
                        location.reload();
                        clearInterval(interval);
                    }
                    //閬垮厤鏄剧ず璐熸暟
                    $("#alert_time_out_second_span").text(val < 0 ? 0 : val);

                }, 1000);
            }
        });

    }
}

//鏄惁寮€鍚湪绾跨洃鎺�
if (checkAlive == "true") {
    setInterval(function() {
        $.ajax({
            async: false,
            url: caspath + "/alive",
            type: "GET",
            dataType: 'jsonp',
            jsonp: "callback",
            data: {
                tgt: tgt
            },
            jsonpCallback: "alive",
            success: function(json) {
                if (!json) {
                    Msg.warning("鐢ㄦ埛宸叉帀绾匡紝璇烽噸鏂扮櫥褰曘€�", function() {
                        location.href = contextpath + "/logout";
                    });
                }
            }
        });
    }, 60000); //1000涓�1绉掗挓
}

/**
 * 娓呯┖鏉′欢閫夐」
 * pram	閫夐」澶栧眰鏍囩DOM鐨刬d
 */
template.clearCondition = function($this) {
    $("#" + $this).find('input[type="text"]').each(function() {
        $(this).val("");
    });
    $("#" + $this).find('select').each(function() {
        $(this).selectpicker('val', '');
        $(this).selectpicker('refresh');
    });
}

/**
 * base64
 * @type 
 */
template.BASE64 = {
    // public method for encoding 
    聽聽encode: function(input) {
        聽聽聽聽var output = "";
        聽聽聽聽var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
        聽聽聽聽var i = 0;
        聽聽聽聽input = template.CODE.utf8_encode(input);
        聽聽聽聽while(i < input.length) {
            聽聽聽聽聽聽chr1 = input.charCodeAt(i++);
            聽聽聽聽聽聽chr2 = input.charCodeAt(i++);
            聽聽聽聽聽聽chr3 = input.charCodeAt(i++);
            聽聽聽聽聽聽enc1 = chr1 >> 2;
            聽聽聽聽聽聽enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
            聽聽聽聽聽聽enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
            聽聽聽聽聽聽enc4 = chr3 & 63;
            聽聽聽聽聽聽if(isNaN(chr2)) {
                    聽聽聽聽聽聽聽聽enc3 = enc4 = 64;
                    聽聽聽聽聽聽
                } else if (isNaN(chr3)) {
                    聽聽聽聽聽聽聽聽enc4 = 64;
                    聽聽聽聽聽聽
                }
            聽聽聽聽聽聽output = output +
                聽聽聽聽聽聽template.CODE.keyStr.charAt(enc1) + template.CODE.keyStr.charAt(enc2) +
                聽聽聽聽聽聽template.CODE.keyStr.charAt(enc3) + template.CODE.keyStr.charAt(enc4);
            聽聽聽聽
        }
        聽聽聽聽return output;
        聽聽
    },
    聽聽 // public method for decoding 
    聽聽decode: function(input) {
        聽聽聽聽var output = "";
        聽聽聽聽var chr1, chr2, chr3;
        聽聽聽聽var enc1, enc2, enc3, enc4;
        聽聽聽聽var i = 0;
        聽聽聽聽input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");
        聽聽聽聽while(i < input.length) {
            聽聽聽聽聽聽enc1 = template.CODE.keyStr.indexOf(input.charAt(i++));
            聽聽聽聽聽聽enc2 = template.CODE.keyStr.indexOf(input.charAt(i++));
            聽聽聽聽聽聽enc3 = template.CODE.keyStr.indexOf(input.charAt(i++));
            聽聽聽聽聽聽enc4 = template.CODE.keyStr.indexOf(input.charAt(i++));
            聽聽聽聽聽聽chr1 = (enc1 << 2) | (enc2 >> 4);
            聽聽聽聽聽聽chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
            聽聽聽聽聽聽chr3 = ((enc3 & 3) << 6) | enc4;
            聽聽聽聽聽聽output = output + String.fromCharCode(chr1);
            聽聽聽聽聽聽if(enc3 != 64) {
                聽聽聽聽聽聽聽聽output = output + String.fromCharCode(chr2);
                聽聽聽聽聽聽
            }
            聽聽聽聽聽聽if(enc4 != 64) {
                聽聽聽聽聽聽聽聽output = output + String.fromCharCode(chr3);
                聽聽聽聽聽聽
            }
            聽聽聽聽
        }
        聽聽聽聽output = template.CODE.utf8_decode(output);
        聽聽聽聽return output;
        聽聽
    }
    聽
};
template.CODE = {
    keyStr: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
    聽 // private method for UTF-8 encoding 
    utf8_encode: function(string) {
        聽聽聽聽string = string.replace(/\r\n/g, "\n");
        聽聽聽聽var utftext = "";
        聽聽聽聽for(var n = 0; n < string.length; n++) {
            聽聽聽聽聽聽var c = string.charCodeAt(n);
            聽聽聽聽聽聽if(c < 128) {
                    聽聽聽聽聽聽聽聽utftext += String.fromCharCode(c);
                    聽聽聽聽聽聽
                } else if ((c > 127) && (c < 2048)) {
                    聽聽聽聽聽聽聽聽utftext += String.fromCharCode((c >> 6) | 192);
                    聽聽聽聽聽聽聽聽utftext += String.fromCharCode((c & 63) | 128);
                    聽聽聽聽聽聽
                } else {
                    聽聽聽聽聽聽聽聽utftext += String.fromCharCode((c >> 12) | 224);
                    聽聽聽聽聽聽聽聽utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                    聽聽聽聽聽聽聽聽utftext += String.fromCharCode((c & 63) | 128);
                    聽聽聽聽聽聽
                }
            聽聽聽聽
        }
        聽聽聽聽return utftext;
        聽聽
    },
    聽 // private method for UTF-8 decoding 
    聽utf8_decode: function(utftext) {
        聽聽聽聽var string = "";
        聽聽聽聽var i = 0;
        聽聽聽聽var c = c1 = c2 = 0;
        聽聽聽聽while(i < utftext.length) {
            聽聽聽聽聽聽c = utftext.charCodeAt(i);
            聽聽聽聽聽聽if(c < 128) {
                    聽聽聽聽聽聽聽聽string += String.fromCharCode(c);
                    聽聽聽聽聽聽聽聽i++;
                    聽聽聽聽聽聽
                } else if ((c > 191) && (c < 224)) {
                    聽聽聽聽聽聽聽聽c2 = utftext.charCodeAt(i + 1);
                    聽聽聽聽聽聽聽聽string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
                    聽聽聽聽聽聽聽聽i += 2;
                    聽聽聽聽聽聽
                } else {
                    聽聽聽聽聽聽聽聽c2 = utftext.charCodeAt(i + 1);
                    聽聽聽聽聽聽聽聽c3 = utftext.charCodeAt(i + 2);
                    聽聽聽聽聽聽聽聽string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
                    聽聽聽聽聽聽聽聽i += 3;
                    聽聽聽聽聽聽
                }
            聽聽聽聽
        }
        聽聽聽聽return string;
        聽聽
    }
};