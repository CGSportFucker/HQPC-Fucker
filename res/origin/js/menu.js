jQuery.namespace("sysmenu");

//闅愯棌涓嬮潰鍒楄〃涓殑鎵€鏈夎彍鍗�
sysmenu.menus = ['sys/uacm/profile', 'up/calendar', 'sys/uacm/msgcenter', 'up/publicity/show', 'up/publicity', 'fp/serveapply', 'apps/meeting/meetingHome', 'jp/healthyCode', 'jp/healthreport', 'jp/qrcodesigned', 'jp/newpim/detail', 'jp/healthyRule', 'tp/temporary'];

sysmenu.addSecondTab = function(item_id, item_url, item_name, second_item_id, active, refresh) {
    $(window).unbind("hashchange");
    //濡傛灉宸茬粡宸茬粡娣诲姞杩囦簡
    if ($("#tab_dynamic_" + item_id).length > 0) {
        return;
    }
    var dom = $('<li class="swiper-slide ' + (active ? "active" : "") + '" id="tab_dynamic_' + item_id + '"> <a class="ui-link" name="a_tab_second_item">' + item_name +
        '<font style="position:absolute;top: 5px;right: 5px;font-size:12px;line-height:1;">x</font><span class="shadow"></span></a> </li>');
    //鍏抽棴褰撳墠tab浜嬩欢
    dom.find("font").unbind("click").click(function(event) {
        var $li = $(this).parent().parent();
        var $pre = $li.prevAll().find("a[name='a_tab_second_item']:visible").last();
        var $next = $li.nextAll().find("a[name='a_tab_second_item']:visible").first();
        if ($li.hasClass("active") && $next.length > 0) {
            $next.parent().addClass("active"); //楂樹寒鍚庝竴涓�
            $next.trigger("click");
        } else if ($li.hasClass("active") && $pre.length > 0) {
            $pre.parent().addClass("active"); //楂樹寒鍓嶄竴涓�
            $pre.trigger("click");
        } else if ($li.hasClass("active")) {
            Msg.info("鏈€鍚庝竴涓猅ab椤甸潰涓嶅彲鍏抽棴");
            return;
        }
        event.stopPropagation();
        if (sessionStorage) {
            var tabs = sessionStorage.getItem("secondTabMenu");
            tabs = $.parseJSON(tabs);
            tabs = $.grep(tabs, function(o) {
                return o.item_id != $li.attr("id").replace("tab_dynamic_", "");
            });
            sessionStorage.setItem("secondTabMenu", JSON.stringify(tabs));
        }
        $li.remove(); //闅愯棌褰撳墠鑿滃崟
    });

    //閫変腑褰撳墠tab浜嬩欢
    dom.unbind("click").click(function(event) {
        sysmenu.hideMenu();
        $("a[name='a_tab_second_item']").parent().removeClass("active");
        $(this).addClass("active");
        Util.setHash("act=" + item_url);
    });
    $('a[name="a_tab_second_item"][tab_second_item_id="' + second_item_id + '"]').parent().parent().append(dom);

    if (sessionStorage) {
        var tabs = sessionStorage.getItem("secondTabMenu");
        if (!tabs) {
            tabs = [{ "item_id": item_id, "item_url": item_url, "item_name": item_name, "second_item_id": second_item_id }];
        } else {
            tabs = $.parseJSON(tabs);
            var exist = $.grep(tabs, function(o) {
                return o.item_id == item_id;
            });
            //濡傛灉涓嶅瓨鍦ㄥ垯璁板綍鍒皊essionStorage
            if (exist.length == 0) {
                tabs.push({ "item_id": item_id, "item_url": item_url, "item_name": item_name, "second_item_id": second_item_id });
            }
        }
        sessionStorage.setItem("secondTabMenu", JSON.stringify(tabs));
    }
    if (active && refresh) {
        Util.load(item_url);
    }
}


$(function() {
    //	if($("div[name='level1']").length==0){
    //		//娌℃湁涓€绾ц彍鍗曪紝鐩存帴鏄剧ず403
    //		Util.load(contextpath+"/403");
    //		return ;
    //	}
    var phone_act = Util.getHash(location.hash, 'act');
    //缁戝畾鑿滃崟鐐瑰嚮浜嬩欢
    $("#jp_home_menu a.menu-box").unbind("click").click(function() {
        $("#jp_home_menu a.menu-box").removeClass("active");
        $(this).addClass("active");
        var act = $(this).attr("addr");
        Util.setHash("act=" + act);
    });
    $("#jp_home_menu").show();
    $("#jp_home_menu a.menu-box").removeClass("active");
    var jpmenu = phone_act.split("/")[0] + "/" + phone_act.split("/")[1];
    $("a[addr='" + jpmenu + "']").addClass("active");

    if (window.history && window.history.pushState) {
        $(window).on('popstate', function() {
            var phone_act_change = Util.getHash(location.hash, 'act');
            $("#jp_home_menu").show();
            $("#jp_home_menu a.menu-box").removeClass("active");
            var jpmenu = phone_act_change.split("/")[0] + "/" + phone_act_change.split("/")[1];
            $("a[addr='" + jpmenu + "']").addClass("active");
        });
    }

    //浠呬粎鏄洃鍚琣ct 鐨� hashchange浜嬩欢
    back_act_listener = Util.getHash(location.hash, 'act');
    window.addEventListener('hashchange', function() {
        var current_act = Util.getHash(location.hash, 'act');
        //鍥為€€鐨勬椂鍊欏鏋渁ct鐨勫€间笉涓€鏍锋墠閲嶆柊鍔犺浇椤甸潰
        if (current_act != back_act_listener) {
            // 绂诲紑apply椤甸潰鎴栦粠鍏朵粬椤甸潰杩涘叆apply椤甸潰娓呯┖sessionStorage
            if ("ep/basicda/apply" == back_act_listener || "ep/basicda/apply" == current_act) {
                if (window.sessionStorage) {
                    sessionStorage.clear();
                }
            }
            //濡傛灉椤甸潰杩樺仠鐣欏湪鐢ㄦ埛鑷畾涔夌粍浠剁殑椤甸潰锛屽垯杩涜鍒锋柊
            if ("portal/tpl/urc" == back_act_listener) {
                location.reload();
                return;
            }
            var locationhash = location.hash;
            back_act_listener = current_act;
            var cpparams = Util.getHash(location.hash, "cpparams", "");
            var targettype = "";
            var parenthash = "";
            var targetact = "";
            if (cpparams != "cpparams" && cpparams != "") {
                cpparams = template.BASE64.decode(cpparams);
                cpparams = JSON.parse(cpparams);
                targettype = cpparams.targettype;
                parenthash = cpparams.parenthash;
                targetact = cpparams.targetact;
                if (Util.isNotEmpty(targetact)) {
                    current_act = targetact;
                }
            } else {
                //鍦板潃鏍忎笂鐨刟ct鍊间笉鏄€氳繃鐐瑰嚮鑿滃崟鍒囨崲锛岃€屾槸閫氳繃鎵嬪姩瑙﹀彂鐨勬椂鍊欒Е鍙慳ct鏀瑰彉
                sysmenu.renderMenuByAct(current_act);
            }
            //濡傛灉鏄洿鎺ユ樉绀洪潤鎬佸钩閾鸿彍鍗�
            if (current_act.indexOf("static_show_") != -1) {
                return;
            }

            Util.load(current_act, function() {
                //鍦ㄥ垏鎹㈣彍鍗曟椂锛岄厤缃ā鍧梙ash澧炲姞cpparams鍙傛暟锛岀敤浜庡垽鏂槸鍚﹂噸鏂板姞杞介〉闈�
                if (current_act.indexOf("cp/templateList/p") > -1) {
                    //褰撹彍鍗曚负閰嶇疆妯″潡鏃讹紝娓呯悊缂撳瓨銆�
                    if (window.localStorage) {
                        localStorage.clear();
                    }
                    if (cpparams == "") {
                        Util.setHash("cpparams=cpparams");
                    }
                } else {
                    Util.setHash(locationhash);
                }
            });
        }
        //闅愯棌鑿滃崟
        $("#jp_home_menu").show();
        if ($.inArray(current_act.split('?')[0], sysmenu.menus) != -1) {
            sysmenu.hideMenu();
        }
    }, false);

    //鏄剧ず宸︿晶鑿滃崟
    sysmenu.showMenu = function(dom) {
        sysmenu.hideMenu();
        if (hidemenu == true || hidemenu == 'true') {
            return;
        }
        //閬垮厤闇€瑕侀殣钘忕殑鑿滃崟闂竴涓�
        if ($.inArray(Util.getHash(location.hash, 'act'), sysmenu.menus) != -1) {
            sysmenu.hideMenu();
            return;
        }
        $("#" + dom).show();
        if (dom == 'div_menu_mini_01') {
            //1闅愯棌鎵€鏈変簩绾ab鑿滃崟
            $("div[name='div_tab_second_menu']").hide();
        }
        $(".page-content").removeAttr("style");
    };

    //鍦板潃鏍忎笂鐨刟ct鍊间笉鏄€氳繃鐐瑰嚮鑿滃崟鍒囨崲锛岃€屾槸閫氳繃鎵嬪姩瑙﹀彂鐨勬椂鍊欒Е鍙慳ct鏀瑰彉
    sysmenu.renderMenuByAct = function(current_act) {
        //濡傛灉鏄竴绾ф櫘閫氳彍鍗�
        if ($("div[name='level1']").find("a[name='first_item_1'][perm_item_url='" + current_act + "']").length > 0) {
            //娓呯┖鎵€鏈変竴绾ц彍鍗曠殑閫変腑鏍峰紡
            $("div[name='level1']").removeClass("active bg-act");
            //娣诲姞閫変腑鏍峰紡
            $("div[name='level1']").find("a[perm_item_url='" + current_act + "']").parent().addClass("active bg-act");
            sysmenu.hideMenu();
        }
        //濡傛灉鏄簩绾ф櫘閫氳彍鍗�
        else if ($("li[name='level2']").find("a[name='second_item_1'][perm_item_url='" + current_act + "']").length > 0) {
            var item = $("li[name='level2']").find("a[perm_item_url='" + current_act + "']");
            //鎵惧埌浠栫殑鐖秈d
            var second_item_fid = $(item).parent().attr("second_item_fid");
            //娓呯┖鎵€鏈変竴绾ц彍鍗曠殑閫変腑鏍峰紡
            $("div[name='level1']").removeClass("active bg-act");
            //閫変腑鍏朵竴绾ц妭鐐硅彍鍗�
            $("a[first_item_id='" + second_item_fid + "']").parent().addClass("active bg-act");
            //闅愯棌鎵€鏈夌殑浜岀骇鑿滃崟
            $('li[name="level2"]').hide();
            //鐒跺悗鏄剧ず杩欎釜涓€绾ц彍鍗曞叧鑱旂殑鎵€鏈変簩绾ц彍鍗�
            $("li[second_item_fid='" + second_item_fid + "']").show();
            //娓呯┖鎵€鏈変簩绾ц彍鍗曠殑閫変腑鏍峰紡
            $('li[name="level2"]').removeClass("active");
            //娣诲姞褰撳墠鐐瑰嚮鑿滃崟鐨勯€変腑鏍峰紡
            $(item).parent().addClass("active");
            sysmenu.showMenu("div_menu_mini_01");
        }
        //濡傛灉鏄簩绾AB褰㈠紡鑿滃崟
        else if ($("div[name='div_tab_second_menu']").find("a[name='a_tab_second_item'][tab_perm_url='" + current_act + "']").length > 0) {
            // 娓呯┖鎵€鏈変竴绾ц彍鍗曠殑閫変腑鏍峰紡
            $("div[name='level1']").removeClass("active bg-act");
            // 闅愯棌鎵€鏈夊乏渚т簩绾ц彍鍗�
            sysmenu.hideMenu();
            // 鎵惧埌褰撳墠閫変腑鐨勮彍鍗� 
            var item = $("div[name='div_tab_second_menu']").find("a[name='a_tab_second_item'][tab_perm_url='" + current_act + "']");
            // 寰楀埌浠栫殑鐖剁骇瀵艰埅鑿滃崟鐨刬temid
            var item_fid = $(item).attr("tab_first_item_id");
            // 鎶婂綋鍓嶉€変腑鑿滃崟鐨勬墍鏈夊厔寮熻妭鐐归兘鍙栨秷閫変腑
            $(item).parent().siblings().removeClass("active");
            // 鎶婂綋鍓嶉€変腑鑿滃崟澧炲姞閫変腑鏁堟灉
            $(item).parent().addClass("active");
            // 璁╁鑸€変腑
            $("a[name='first_item_2'][perm_item_id='" + item_fid + "']").parent().addClass("active bg-act");
            // 鏄剧ずtab閭ｄ竴鏉＄櫧鑹叉潯
            $("#div_tab_second_menu_" + item_fid).show();
        }
        //濡傛灉鏄笁绾ф櫘閫氳彍鍗�
        else if ($("li[name='level3']").find("a[name='third_item_1'][perm_item_url='" + current_act + "']").length > 0) {
            //濡傛灉鑿滃崟閰嶇疆鐨勬槸甯︽湁&鍙傛暟鐨勮矾寰�
            var perm_item_url = location.hash.substring(location.hash.indexOf("act=") + 4);
            var item = $("li[name='level3']").find("a[name='third_item_1'][perm_item_url='" + perm_item_url + "']");
            if (item.length == 0) {
                item = $("li[name='level3']").find("a[name='third_item_1'][perm_item_url='" + current_act + "']");
            }
            //鎵惧埌鍏朵簩绾ц彍鍗�
            var third_item_fid = $(item).parent().attr("third_item_fid");
            //娓呯┖鎵€鏈変簩绾ц彍鍗曠殑閫変腑鏍峰紡
            $('li[name="level2"]').removeClass("active");
            //鍏ㄩ儴璁剧疆涓哄悜涓嬪叧闂殑鎸夐挳
            $('span[name="level2_icon"]').removeClass("fa-angle-up").addClass("fa-angle-down");
            //灏嗕簩绾ф牱寮忛€変腑
            $("a[second_item_id='" + third_item_fid + "']").parent().addClass("active");
            //灏嗕簩绾ц彍鍗曠殑绠ご鍚戜笂
            $("a[second_item_id='" + third_item_fid + "']").find('span[name="level2_icon"]').removeClass("fa-angle-down").addClass("fa-angle-up");

            //鎵惧埌鍏朵竴绾ц彍鍗�
            var second_item_fid = $("a[second_item_id='" + third_item_fid + "']").parent().attr("second_item_fid");
            //闅愯棌鎵€鏈夌殑浜岀骇鑿滃崟
            $('li[name="level2"]').hide();
            //鏄剧ず鎵€鏈夊叾鐩稿叧鐨勪簩绾ц彍鍗�
            $("li[second_item_fid='" + second_item_fid + "']").show();
            //娓呯┖鎵€鏈変竴绾ц彍鍗曠殑閫変腑鏍峰紡
            $("div[name='level1']").removeClass("active bg-act");
            //閫変腑鍏朵竴绾ц妭鐐硅彍鍗�
            $("a[first_item_id='" + second_item_fid + "']").parent().addClass("active bg-act");
            //娓呯┖鎵€鏈塴eve3鐨勯€変腑鏍峰紡
            $("li[name='level3']").removeClass("active");
            //閫変腑褰撳墠鐨勮彍鍗�
            $(item).parent().addClass("active");
            sysmenu.showMenu("div_menu_mini_01");
        }
    }

    //浠庣Щ鍔ㄥ皬绐楀彛鍒囨崲鍒板ぇ绐楀彛淇濇寔宸︿晶鑿滃崟鐨勯€変腑鐘舵€�
    //    sysmenu.winWidth = $("body").width() ;
    //    $(window).resize(function () {
    //    	//褰撳搴﹀彉鍖栬秴杩�20锛岃Е鍙戜笅闈�
    //    	if(Math.abs(sysmenu.winWidth - $("body").width())>20){
    //    		sysmenu.winWidth = $("body").width() ;
    //    		var locationhash = location.hash ;
    //    		sysmenu.initMenu(back_act_listener);
    //    		Util.setHash(locationhash);
    //    	}
    //    });

    //闅愯棌宸︿晶鑿滃崟
    sysmenu.hideMenu = function() {
        $(".page-sidebar").hide();
        $(".page-content").css("margin-left", 0);
        $(".page-sidebar").mCustomScrollbar("disable", true);
        $(".page-sidebar .mCustomScrollBox").css("max-height", "");
        //闅愯棌鎵嬫満绔彍鍗�
        //		$("#jp_home_menu").hide();
        $("#jp_home_menu").css("display", "none");
    };


    //濡傛灉鐐瑰嚮鐨勬槸涓€绾ц彍鍗曪紙鏅€氭潈闄愰」锛�
    $("a[name='first_item_1']").click(function() {
        //娓呯┖鎵€鏈変竴绾ц彍鍗曠殑閫変腑鏍峰紡
        $("div[name='level1']").removeClass("active bg-act");

        //娣诲姞閫変腑鏍峰紡
        $(this).parent().addClass("active bg-act");
        var url = $(this).attr("perm_item_url"); //鑾峰彇鍏惰烦杞殑URL
        if (index_act) {
            //濡傛灉鏄埛鏂拌繘鏉ョ殑
            location.hash = locationhash;
        } else {
            //鍒囨崲鑿滃崟蹇呴』瑕佹竻绌哄叾浠杊ash鍊�
            Util.setHash("act=" + url);
        }
        //涓€绾ц彍鍗曚负鏅€氭潈闄愰」锛岄殣钘忓乏渚ц彍鍗�
        sysmenu.hideMenu();
        //绉诲姩绔偣鍑绘櫘閫氭潈闄愰」鐨勬椂鍊欓殣钘忚彍鍗�
        $("#mobile_header_container").removeClass("active");
        $("div[name='div_tab_second_menu']").hide();
    });

    //鐐瑰嚮宸︿晶鐨勪簩绾ц彍鍗曪紙鏅€氭潈闄愰」锛�
    $("a[name='second_item_1']").click(function() {
        //鎵惧埌浠栫殑鐖秈d
        var second_item_fid = $(this).parent().attr("second_item_fid");
        //娓呯┖鎵€鏈変竴绾ц彍鍗曠殑閫変腑鏍峰紡
        $("div[name='level1']").removeClass("active bg-act");
        //閫変腑鍏朵竴绾ц妭鐐硅彍鍗�
        $("a[first_item_id='" + second_item_fid + "']").parent().addClass("active bg-act");
        //闅愯棌鎵€鏈夌殑浜岀骇鑿滃崟
        $('li[name="level2"]').hide();
        //鐒跺悗鏄剧ず杩欎釜涓€绾ц彍鍗曞叧鑱旂殑鎵€鏈変簩绾ц彍鍗�
        $("li[second_item_fid='" + second_item_fid + "']").show();
        //娓呯┖鎵€鏈変簩绾ц彍鍗曠殑閫変腑鏍峰紡
        $('li[name="level2"]').removeClass("active");
        //娣诲姞褰撳墠鐐瑰嚮鑿滃崟鐨勯€変腑鏍峰紡
        $(this).parent().addClass("active");
        var url = $(this).attr("perm_item_url");
        if (url) {
            if (index_act) {
                //濡傛灉鏄埛鏂拌繘鏉ョ殑
                location.hash = locationhash;
            } else {
                //鑾峰彇浜岀骇鑿滃崟涓婃槸鍚︽湁hash鍊煎睘鎬�
                var hasHash = $(this).attr("hash");
                //鍒囨崲鑿滃崟蹇呴』瑕佹竻绌哄叾浠杊ash鍊�
                Util.setHash("act=" + url + (hasHash ? "&" + hasHash : ''));
            }
            sysmenu.showMenu("div_menu_mini_01");
        }
    });

    //浜岀骇鑿滃崟鍒嗙粍鏉冮檺椤�
    $("a[name='second_item_2']").click(function() {
        //鍏ㄩ儴璁剧疆涓哄悜涓嬪叧闂殑鎸夐挳
        $('span[name="level2_icon"]').removeClass("fa-angle-up").addClass("fa-angle-down");

        //濡傛灉鏄睍寮€锛屽垯鏀惰捣
        if ($(this).parent().hasClass("active")) {
            $(this).parent().removeClass("active");
            return;
        }
        $(this).find('span[name="level2_icon"]').removeClass("fa-angle-down").addClass("fa-angle-up");

        //瑙﹀彂鍏剁涓€涓笁绾ц彍鍗曠殑鐐瑰嚮浜嬩欢
        var third_item_fid = $(this).attr("second_item_id");
        var third_item_a = $("li[third_item_fid='" + third_item_fid + "'] a").first();
        //濡傛灉涓夌骇鑿滃崟鐨勭涓€涓槸澶栭摼
        if (third_item_a.attr("href") &&
            third_item_a.attr("href").toLowerCase() != "javascript:;") {
            //鏄剧ず涓夌骇鑿滃崟
            third_item_a.parent().parent().parent().addClass("active");
            third_item_a.parent().addClass("active");
            //鍏ㄩ儴璁剧疆涓哄悜涓嬪叧闂殑鎸夐挳
            $('span[name="level3_icon"]').removeClass("fa-angle-up").addClass("fa-angle-down");
            third_item_a.find("span").trigger("click");
            third_item_a.unbind("click");
        } else {
            third_item_a.trigger("click");
        }
    });

    //鐐瑰嚮宸︿晶涓夌骇鑿滃崟锛堟櫘閫氭潈闄愰」锛�
    $("a[name='third_item_1']").click(function() {
        //鎵惧埌鍏朵簩绾ц彍鍗�
        var third_item_fid = $(this).parent().attr("third_item_fid");
        //娓呯┖鎵€鏈変簩绾ц彍鍗曠殑閫変腑鏍峰紡
        $('li[name="level2"]').removeClass("active");
        //鍏ㄩ儴璁剧疆涓哄悜涓嬪叧闂殑鎸夐挳
        $('span[name="level2_icon"]').removeClass("fa-angle-up").addClass("fa-angle-down");
        //灏嗕簩绾ф牱寮忛€変腑
        $("a[second_item_id='" + third_item_fid + "']").parent().addClass("active");
        //灏嗕簩绾ц彍鍗曠殑绠ご鍚戜笂
        $("a[second_item_id='" + third_item_fid + "']").find('span[name="level2_icon"]').removeClass("fa-angle-down").addClass("fa-angle-up");

        //鎵惧埌鍏朵竴绾ц彍鍗�
        var second_item_fid = $("a[second_item_id='" + third_item_fid + "']").parent().attr("second_item_fid");
        //闅愯棌鎵€鏈夌殑浜岀骇鑿滃崟
        $('li[name="level2"]').hide();
        //鏄剧ず鎵€鏈夊叾鐩稿叧鐨勪簩绾ц彍鍗�
        $("li[second_item_fid='" + second_item_fid + "']").show();
        //娓呯┖鎵€鏈変竴绾ц彍鍗曠殑閫変腑鏍峰紡
        $("div[name='level1']").removeClass("active bg-act");
        //閫変腑鍏朵竴绾ц妭鐐硅彍鍗�
        $("a[first_item_id='" + second_item_fid + "']").parent().addClass("active bg-act");
        //娓呯┖鎵€鏈塴eve3鐨勯€変腑鏍峰紡
        $("li[name='level3']").removeClass("active");
        //閫変腑褰撳墠鐨勮彍鍗�
        $(this).parent().addClass("active");
        var url = $(this).attr("perm_item_url");
        if (url) {
            if (index_act) {
                //濡傛灉鏄埛鏂拌繘鏉ョ殑
                location.hash = locationhash;
            } else {
                //鍒囨崲鑿滃崟蹇呴』瑕佹竻绌哄叾浠杊ash鍊�
                Util.setHash("act=" + url);
            }
            sysmenu.showMenu("div_menu_mini_01");
        }
    });

    //涓夌骇鑿滃崟鍒嗙粍鏉冮檺椤�
    $("a[name='third_item_2']").click(function() {

        //鍏ㄩ儴璁剧疆涓哄悜涓嬪叧闂殑鎸夐挳
        $('span[name="level3_icon"]').removeClass("fa-angle-up").addClass("fa-angle-down");

        //濡傛灉鏄睍寮€锛屽垯鏀惰捣
        if ($(this).parent().hasClass("active")) {
            $(this).parent().removeClass("active");
            return;
        }

        //鎵惧埌鍏朵簩绾ц彍鍗�
        var third_item_fid = $(this).parent().attr("third_item_fid");
        //娓呯┖鎵€鏈変簩绾ц彍鍗曠殑閫変腑鏍峰紡
        $('li[name="level2"]').removeClass("active");
        //鍏ㄩ儴璁剧疆涓哄悜涓嬪叧闂殑鎸夐挳
        $('span[name="level2_icon"]').removeClass("fa-angle-up").addClass("fa-angle-down");
        //灏嗕簩绾ф牱寮忛€変腑
        $("a[second_item_id='" + third_item_fid + "']").parent().addClass("active");
        //灏嗕簩绾ц彍鍗曠殑绠ご鍚戜笂
        $("a[second_item_id='" + third_item_fid + "']").find('span[name="level2_icon"]').removeClass("fa-angle-down").addClass("fa-angle-up");

        //鎵惧埌鍏朵竴绾ц彍鍗�
        var second_item_fid = $("a[second_item_id='" + third_item_fid + "']").parent().attr("second_item_fid");
        //闅愯棌鎵€鏈夌殑浜岀骇鑿滃崟
        $('li[name="level2"]').hide();
        //鏄剧ず鎵€鏈夊叾鐩稿叧鐨勪簩绾ц彍鍗�
        $("li[second_item_fid='" + second_item_fid + "']").show();
        //娓呯┖鎵€鏈変竴绾ц彍鍗曠殑閫変腑鏍峰紡
        $("div[name='level1']").removeClass("active bg-act");
        //閫変腑鍏朵竴绾ц妭鐐硅彍鍗�
        $("a[first_item_id='" + second_item_fid + "']").parent().addClass("active bg-act");
        //娓呯┖鎵€鏈塴eve3鐨勯€変腑鏍峰紡
        $("li[name='level3']").removeClass("active");

        //鍏ㄩ儴璁剧疆涓哄悜涓嬪叧闂殑鎸夐挳
        $('span[name="level3_icon"]').removeClass("fa-angle-up").addClass("fa-angle-down");

        //鏄剧ず涓夌骇鑿滃崟
        $("li[name='level3']").show();
        //閫変腑褰撳墠涓夌骇鑿滃崟
        $(this).parent().addClass("active");
        $(this).find('span[name="level3_icon"]').removeClass("fa-angle-down").addClass("fa-angle-up");

        //瑙﹀彂鍏剁涓€鍥涚骇鑿滃崟鐨勭偣鍑讳簨浠�
        var fourth_item_fid = $(this).attr("third_item_id");
        var fourth_item_a = $("li[fourth_item_fid='" + fourth_item_fid + "'] a").first();
        //濡傛灉鍥涚骇鑿滃崟鐨勭涓€涓槸澶栭摼
        if (fourth_item_a.attr("href") &&
            fourth_item_a.attr("href").toLowerCase() != "javascript:;") {
            fourth_item_a.find("span").trigger("click");
            fourth_item_a.unbind("click");
            //鏄剧ず鍥涚骇鑿滃崟
            fourth_item_a.parent().parent().show();
            fourth_item_a.parent().addClass("active");
        } else {
            fourth_item_a.trigger("click");
        }
    });

    //鐐瑰嚮宸︿晶鍥涚骇鑿滃崟锛堟櫘閫氭潈闄愰」锛�
    $("a[name='fourth_item_1']").click(function() {
        //鏄剧ず鍥涚骇鑿滃崟
        $(this).parent().parent().show();
        $(this).parent().addClass("active");
        //閫変腑涓夌骇鑿滃崟
        $(this).parent().parent().parent().show().addClass("active");
        $(this).parent().parent().parent().find('span[name="level3_icon"]').removeClass("fa-angle-down").addClass("fa-angle-up");
        //鏄剧ず鍏ㄩ儴涓夌骇鑿滃崟
        var third_item_fid = $(this).parent().parent().parent().attr("third_item_fid");
        $("li[name='level3'][third_item_fid='" + third_item_fid + "']").show();

        //閫変腑浜岀骇鑿滃崟
        $(this).parent().parent().parent().parent().parent().show().addClass("active");
        $(this).parent().parent().parent().parent().parent().find('span[name="level2_icon"]').removeClass("fa-angle-down").addClass("fa-angle-up");
        //鏄剧ず鍏ㄩ儴鐨勪簩绾ц彍鍗�
        var second_item_fid = $(this).parent().parent().parent().parent().parent().attr("second_item_fid");
        $("li[name='level2'][second_item_fid='" + second_item_fid + "']").show();

        //娓呯┖鎵€鏈変竴绾ц彍鍗曠殑閫変腑鏍峰紡
        $("div[name='level1']").removeClass("active bg-act");
        //閫変腑鍏朵竴绾ц妭鐐硅彍鍗�
        $("a[first_item_id='" + second_item_fid + "']").parent().addClass("active bg-act");

        $(this).parent().parent().show();
        $(this).parent().addClass("active");
        var url = $(this).attr("perm_item_url");
        if (url) {
            if (index_act) {
                //濡傛灉鏄埛鏂拌繘鏉ョ殑
                location.hash = locationhash;
            } else {
                //鍒囨崲鑿滃崟蹇呴』瑕佹竻绌哄叾浠杊ash鍊�
                Util.setHash("act=" + url);
            }
            sysmenu.showMenu("div_menu_mini_01");
        }
    });

    //濡傛灉鐐瑰嚮鐨勬槸涓€绾ц彍鍗曪紙鍒嗙粍鏉冮檺椤癸級
    $("a[name='first_item_2']").click(function() {
        var first_item_id = $(this).attr('first_item_id');
        //鍏堥殣钘忓叏閮ㄧ殑浜岀骇鑿滃崟
        $("li[name='level2']").hide();
        //鐒跺悗鏄剧ず杩欎釜涓€绾ц彍鍗曞叧鑱旂殑鎵€鏈変簩绾ц彍鍗�
        $("li[second_item_fid='" + first_item_id + "']").show();
        //娓呯┖浜岀骇鑿滃崟鐨勬墍鏈夐€変腑鐘舵€�
        $("a[name='second_item_2']").parent().removeClass("active");
        //榛樿瑙﹀彂鍏跺叧鑱旂殑浜岀骇鑿滃崟涓涓€涓彍鍗曠殑鐐瑰嚮浜嬩欢
        $("li[second_item_fid='" + first_item_id + "']").first().find("a:first").trigger("click");

        //========================浜岀骇鑿滃崟涓簍ab鐩稿叧start======================
        //1闅愯棌鎵€鏈変簩绾ab鑿滃崟
        $("div[name='div_tab_second_menu']").hide();
        //娓呯┖tab浜岀骇鑿滃崟鐨勬墍鏈夐€変腑鐘舵€�
        $("a[name='a_tab_second_item']").parent().removeClass("active");
        //2鏄剧ず涓€绾ц彍鍗曞搴旂殑浜岀骇tab鑿滃崟锛屽鏋滄湁tab锛屽啀鏄剧ず
        if ($("#div_tab_second_menu_" + first_item_id).find('a[name="a_tab_second_item"]').length > 0) {
            $("#div_tab_second_menu_" + first_item_id).show();
            $("#div_tab_second_menu_" + first_item_id + " li").show();

            //璁剧疆绗竴涓猅ab涓洪€変腑鐘舵€�
            $("#div_tab_second_menu_" + first_item_id).find("li").removeClass("active");
            $("#div_tab_second_menu_" + first_item_id).find("li:first").addClass("active");
            var tab_second_item_id = $("#div_tab_second_menu_" + first_item_id).find("a:first").attr("tab_second_item_id");
            //鏄剧ず璇ヤ簩绾ц彍鍗曞叧鑱斾笅鐨勬墍鏈変笁绾ц彍鍗�
            $("li[tab_perm_item_fid='" + tab_second_item_id + "']").show();
            //灏嗕笁绾ц彍鍗曢€変腑鐘舵€佸幓鎺�
            $('li[name="li_tab_third_item"]').removeClass("active");
            //娓呯┖鎵€鏈変竴绾ц彍鍗曠殑閫変腑鏍峰紡
            $("div[name='level1']").removeClass("active bg-act");
            //鑾峰彇涓€绾ц彍鍗曠殑ID
            var tab_first_item_id = $("a[tab_second_item_id='" + tab_second_item_id + "'][name='a_tab_second_item']").attr("tab_first_item_id");
            //閫変腑鍏朵竴绾ц妭鐐硅彍鍗�
            $('[first_item_id="' + tab_first_item_id + '"][name="first_item_2"]').parent().addClass("active bg-act");
            //闅愯棌鏅€氫簩绾ц彍鍗�
            $("#div_menu_mini_01").hide();
            //鏄剧ずtab褰㈠紡鐨勪簩绾ц彍鍗�
            $("#div_menu_tab").show(); //濡傛灉tab浜岀骇鑿滃崟涓烘櫘閫氭潈闄愰」
            //			var tab_perm_url = $("#div_tab_second_menu_"+first_item_id).find('a[name="a_tab_second_item"][tab_first_item_id="'+first_item_id+'"]').first().attr("tab_perm_url");
            //			if(tab_perm_url){
            $("#div_tab_second_menu_" + first_item_id).find('a[name="a_tab_second_item"][tab_first_item_id="' + first_item_id + '"]').first().trigger("click");
            //			}
        } else {
            //鏄剧ず鏅€氫簩绾ц彍鍗�
            sysmenu.showMenu("div_menu_mini_01");
        }
        //========================浜岀骇鑿滃崟涓簍ab鐩稿叧end======================
    });

    //濡傛灉鏄偣鍑荤Щ鍔ㄧ鐨勪簩绾ц彍鍗曪紙鏅€氭潈闄愰」锛�
    $("a[name='second_mobile_1']").click(function() {
        //娓呯┖鎵€鏈夌殑閫変腑鏍峰紡
        $("a[name='second_mobile_1']").removeClass("active bg-act");
        //璁剧疆鑷繁鐨勯€変腑鐘舵€�
        $(this).addClass("active bg-act");
        var url = $(this).attr("perm_item_url");
        if (url) {
            if (index_act) {
                //濡傛灉鏄埛鏂拌繘鏉ョ殑
                location.hash = locationhash;
            } else {
                //鍒囨崲鑿滃崟蹇呴』瑕佹竻绌哄叾浠杊ash鍊�
                Util.setHash("act=" + url);
            }
            //绉诲姩绔偣鍑绘櫘閫氭潈闄愰」鐨勬椂鍊欓殣钘忚彍鍗�
            $("#mobile_header_container").removeClass("active");
            sysmenu.showMenu("div_menu_mini_01");
        }
    });

    //濡傛灉鏄偣鍑荤Щ鍔ㄧ浜岀骇鑿滃崟锛堝垎缁勬潈闄愰」锛�
    $('a[name="second_mobile_2"]').click(function() {
        //濡傛灉鏄睍寮€锛屽垯鏀惰捣
        if ($(this).parent().hasClass("active")) {
            $(this).parent().removeClass("active");
            return;
        }
        //鍘绘帀鎵€鏈夌Щ鍔ㄧ浜岀骇鑿滃崟鐨勯€変腑鏍峰紡
        $('a[name="second_mobile_2"]').parent().removeClass("active");
        $('a[name="second_mobile_1"]').removeClass("active");
        //灏嗗綋鍓嶇殑鑿滃崟閫変腑
        $(this).parent().addClass("active");
        //鑾峰彇褰撳墠鑿滃崟鐨刬d
        var second_mobile_id = $(this).attr("second_mobile_id");
        //榛樿瑙﹀彂鍏跺叧鑱旂殑浜岀骇鑿滃崟涓涓€涓彍鍗曠殑鐐瑰嚮浜嬩欢
        $("a[third_mobile_fid='" + second_mobile_id + "']").first().trigger("click");
    });

    //濡傛灉鏄偣鍑荤Щ鍔ㄧ涓夌骇鑿滃崟鏅€氭潈闄愰」
    $("a[name='third_mobile_1']").click(function() {
        //娓呯┖鎵€鏈夌殑涓夌骇鑿滃崟鐨勯€変腑鏍峰紡
        $("a[name='third_mobile_1']").removeClass("active");
        //灏嗗綋鍓嶉」閫変腑
        $(this).addClass("active");
        var url = $(this).attr("perm_item_url");
        if (url) {
            if (index_act) {
                //濡傛灉鏄埛鏂拌繘鏉ョ殑
                location.hash = locationhash;
            } else {
                //鍒囨崲鑿滃崟蹇呴』瑕佹竻绌哄叾浠杊ash鍊�
                Util.setHash("act=" + url);
            }
            //绉诲姩绔偣鍑绘櫘閫氭潈闄愰」鐨勬椂鍊欓殣钘忚彍鍗�
            $("#mobile_header_container").removeClass("active");
        }
    });

    sysmenu.initMenu = function(index_act) {
        //濡傛灉鏈夎闂殑URL璺緞
        if (index_act) {
            var perm_item_url = locationhash.substring(locationhash.indexOf("act=") + 4);
            if ($("a[perm_item_url='" + perm_item_url + "']").length > 0) {
                //瑙﹀彂闈濼ab鑿滃崟鐨刢lick浜嬩欢
                $("a[perm_item_url='" + perm_item_url + "']").trigger("click");
            } else if ($("a[perm_item_url='" + index_act + "']").length > 0) {
                //瑙﹀彂闈濼ab鑿滃崟鐨刢lick浜嬩欢
                $("a[perm_item_url='" + index_act + "']").trigger("click");
            } else if ($("a[name='a_tab_second_item'][tab_perm_url='" + index_act + "']").length > 0) {
                //瑙﹀彂Tab浜岀骇鑿滃崟
                $("a[name='a_tab_second_item'][tab_perm_url='" + index_act + "']").trigger("click");
            } else if ($("a[tab_perm_url='" + index_act + "']").parent().length > 0) {
                //瑙﹀彂Tab闈炰簩绾ц彍鍗�
                $("a[tab_perm_url='" + index_act + "']").parent().trigger("click");
            }
        } else {
            //濡傛灉娌℃湁璁块棶鐨勮矾寰勶紝鍒欓粯璁ゅ姞杞界涓€涓彍鍗�
            $.each($("div[name='level1']"), function(i, o) {
                //濡傛灉涓嶆槸闅愯棌鐨勶紝鍒欎綔涓洪粯璁ょ殑杩涜瑙﹀彂
                if (!$(o).is(":hidden")) {
                    var first_item_a = $(o).find("a").first();
                    //濡傛灉涓€绾ц彍鍗曠殑绗竴涓彍鍗曟槸涓閾撅紝鍒欏鎵句笅涓€涓潪澶栭摼鐨勮彍鍗曡繘琛岃Е鍙�
                    if (first_item_a.attr("href") && first_item_a.attr("href").indexOf("http://") == -1 &&
                        first_item_a.attr("href").indexOf("https://") == -1) {
                        $(o).find("a").first().find("span:first").trigger("click");
                        return false;
                    }
                }
            });
        }

        $(sysmenu.menus).each(function(i, o) {
            if (o == index_act) {
                sysmenu.hideMenu();
                return false;
            }
        });

    };


    //濡傛灉鏄偣鍑籺ab浜岀骇鑿滃崟
    $("a[name='a_tab_second_item']").click(function() {
        //鑾峰彇浜岀骇鑿滃崟鐨処D
        var tab_second_item_id = $(this).attr("tab_second_item_id");
        //鑾峰彇涓€绾ц彍鍗曠殑ID
        var tab_first_item_id = $("a[tab_second_item_id='" + tab_second_item_id + "'][name='a_tab_second_item']").attr("tab_first_item_id");
        //娓呯┖鎵€鏈変竴绾ц彍鍗曠殑閫変腑鏍峰紡
        $("div[name='level1']").removeClass("active bg-act");
        //閫変腑涓€绾ц彍鍗�
        $('[first_item_id="' + tab_first_item_id + '"][name="first_item_2"]').parent().addClass("active bg-act");
        //鏄剧ず浜岀骇鑿滃崟
        $("a[tab_second_item_id='" + tab_second_item_id + "'][name='a_tab_second_item']").parent().parent().parent().parent().parent().show();
        //娓呯┖浜岀骇鑿滃崟鐨勬墍鏈夐€変腑鐘舵€�
        $("a[name='a_tab_second_item']").parent().removeClass("active");
        //璁剧疆浜岀骇鑿滃崟鐨勯€変腑鐘舵€�
        $("a[tab_second_item_id='" + tab_second_item_id + "'][name='a_tab_second_item']").parent().addClass("active");
        //灏嗘墍鏈夌殑tab鍧囩疆涓洪潪active
        $(this).parent().siblings().removeClass("active");
        $(this).parent().addClass("active");
        //闅愯棌鎵€鏈夌殑涓夌骇鑿滃崟
        $('li[name="li_tab_third_item"]').hide();
        //鏄剧ず浜岀骇鑿滃崟瀵瑰簲鐨勪笁绾ц彍鍗�
        $("li[tab_perm_item_fid='" + tab_second_item_id + "']").show();

        //灏唗ab鍒涘缓鍒颁簩绾ц彍鍗曚笂
        if (sessionStorage) {
            var tabs = sessionStorage.getItem("secondTabMenu");
            if (tabs) {
                tabs = $.parseJSON(tabs);
                $(tabs).each(function(i, o) {
                    sysmenu.addSecondTab(o.item_id, o.item_url, o.item_name, o.second_item_id);
                });
            }
        }

        var item_html = $("div[name='tab_panel_" + tab_second_item_id + "']").html().trim(); //浜岀骇骞抽摵鐨勮彍鍗�
        //濡傛灉瀛樺湪浜岀骇骞抽摵鐨勮彍鍗�
        if (item_html && item_html.trim().length > 0) {
            Util.setHash("act=static_show_" + tab_second_item_id);
            sysmenu.hideMenu(); //闅愯棌宸︿晶鑿滃崟
            //鎷兼帴骞抽摵鑿滃崟
            $("#page-content").html('<div class="data-center-home"><div id="dc_container" class="data-center-tabpage push-up-10">' + item_html + '</div></div>');
            //鑿滃崟鐨勭偣鍑讳簨浠�
            $("#dc_container a").unbind("click").click(function() {
                //娓呯┖浜岀骇鑿滃崟鐨勬墍鏈夐€変腑鐘舵€�
                $("a[name='a_tab_second_item']").parent().removeClass("active");
                var item_id = $(this).attr("item_id");
                var item_url = $(this).attr("item_url");
                //濡傛灉宸茬粡宸茬粡娣诲姞杩囦簡
                if ($("#tab_dynamic_" + item_id).length > 0) {
                    $("#tab_dynamic_" + item_id).addClass("active");
                    Util.setHash("act=" + item_url);
                    return;
                }

                sysmenu.addSecondTab($(this).attr("item_id"), $(this).attr("item_url"), $(this).attr("item_name"), $(this).attr("second_item_id"), true, false);

                Util.setHash("act=" + item_url);
            });
            return;
        }

        //濡傛灉浜岀骇Tab瀛樺湪URL锛屽垯榛樿涓洪潪鍒嗙粍鏉冮檺椤�
        var tab_perm_url = $(this).attr("tab_perm_url");
        if (tab_perm_url) {
            sysmenu.hideMenu();
            Util.setHash("act=" + tab_perm_url);
        } else {
            //鍒嗙粍鏉冮檺椤规病鏈夐厤缃甎RL锛屽苟涓斿叾涓嬮潰娌℃湁瀵瑰簲鐨勮彍鍗�
            if ($("li[tab_perm_item_fid='" + tab_second_item_id + "']:first").length == 0) {
                Util.setHash("act=static_show_" + tab_second_item_id);
                //娓呯┖涓婚潰鏉垮尯鍩�
                $("#page-content").empty();
                //闅愯棌宸︿晶鑿滃崟
                sysmenu.hideMenu();
            } else {
                //涓夌骇鑿滃崟鍘绘帀active
                $('li[name="li_tab_third_item"]').removeClass("active");
                $('li[name="li_tab_third_item"]').find('span[name="level3_icon"]').removeClass("fa-angle-up").addClass("fa-angle-down");
                //浜岀骇鑿滃崟涓哄垎缁勬潈闄愶紝鍒欓粯璁よЕ鍙戝叾绗竴涓笁绾ц彍鍗�
                $("li[tab_perm_item_fid='" + tab_second_item_id + "']:first").trigger("click");
            }
        }
    });

    //鐐瑰嚮Tab涓夌骇鑿滃崟
    $('li[name="li_tab_third_item"]').click(function() {
        //濡傛灉鏄睍寮€锛屽垯鏀惰捣
        if ($(this).hasClass("active") && $(this).find('span[name="level3_icon"]').length > 0) {
            $(this).removeClass("active");
            $(this).find('span[name="level3_icon"]').removeClass("fa-angle-up").addClass("fa-angle-down");
            return;
        }
        //涓夌骇鑿滃崟鍘绘帀active
        $('li[name="li_tab_third_item"]').removeClass("active");
        //鍥涚骇鑿滃崟鍘绘帀active
        $('li[name="li_tab_four_item"]').removeClass("active");
        $(this).find('span[name="level3_icon"]').removeClass("fa-angle-down").addClass("fa-angle-up");
        //閫変腑褰撳墠鑿滃崟
        $(this).addClass("active");
        var url = $(this).find("a").attr("tab_perm_url");
        //鑾峰彇浜岀骇鑿滃崟鐨処D
        var tab_second_item_id = $(this).attr("tab_perm_item_fid");
        //鑾峰彇涓€绾ц彍鍗曠殑ID
        var tab_first_item_id = $("a[tab_second_item_id='" + tab_second_item_id + "'][name='a_tab_second_item']").attr("tab_first_item_id");
        //閫変腑涓€绾ц彍鍗�
        $('[first_item_id="' + tab_first_item_id + '"][name="first_item_2"]').parent().addClass("active bg-act");
        //鏄剧ず浜岀骇鑿滃崟
        $("a[tab_second_item_id='" + tab_second_item_id + "'][name='a_tab_second_item']").parent().parent().parent().parent().parent().show();
        //娓呯┖浜岀骇鑿滃崟鐨勬墍鏈夐€変腑鐘舵€�
        $("a[name='a_tab_second_item']").parent().removeClass("active");
        //璁剧疆浜岀骇鑿滃崟鐨勯€変腑鐘舵€�
        $("a[tab_second_item_id='" + tab_second_item_id + "'][name='a_tab_second_item']").parent().addClass("active");
        //鏄剧ず涓夌骇鑿滃崟
        $('li[tab_perm_item_fid="' + tab_second_item_id + '"][name="li_tab_third_item"]').show();
        //閫変腑涓夌骇鑿滃崟鑿滃崟
        $(this).addClass("active");
        if (url) {
            if (index_act) {
                //濡傛灉鏄埛鏂拌繘鏉ョ殑
                location.hash = locationhash;
            } else {
                //鍒囨崲鑿滃崟蹇呴』瑕佹竻绌哄叾浠杊ash鍊�
                Util.setHash("act=" + url);
            }
            sysmenu.showMenu('div_menu_tab');
        } else {
            //涓夌骇鑿滃崟涓哄垎缁勬潈闄愶紝鍒欓粯璁よЕ鍙戝叾绗竴涓洓绾ц彍鍗�
            var four_item = $(this).find("li:first");
            //濡傛灉鍥涚骇鑿滃崟鏄閾剧被鍨�
            if (four_item.find("a:first").attr("href") &&
                four_item.find("a:first").attr("href").toLowerCase() != "javascript:;") {
                //鏄剧ず宸︿晶鑿滃崟
                sysmenu.showMenu('div_menu_tab');
                //閫変腑褰撳墠鑿滃崟
                $(four_item).addClass("active");
                //闃绘浜嬩欢鍐掓场
                four_item.find("a:first").click(function(event) {
                    event.stopPropagation();
                });
                //娓呯┖涓婚潰鏉�
                $("#page-content").empty();
                four_item.find("span").trigger("click");
            } else {
                four_item.trigger("click");
            }
        }
    });

    //鐐瑰嚮Tab鍥涚骇鑿滃崟
    $('li[name="li_tab_four_item"]').click(function(event) {
        //鑾峰彇浜岀骇鑿滃崟鐨処D
        var tab_second_item_id = $(this).parent().parent().attr("tab_perm_item_fid");
        //鑾峰彇涓€绾ц彍鍗曠殑ID
        var tab_first_item_id = $("a[tab_second_item_id='" + tab_second_item_id + "'][name='a_tab_second_item']").attr("tab_first_item_id");
        //閫変腑涓€绾ц彍鍗�
        $('[first_item_id="' + tab_first_item_id + '"][name="first_item_2"]').parent().addClass("active bg-act");
        //鏄剧ず浜岀骇鑿滃崟
        $("a[tab_second_item_id='" + tab_second_item_id + "'][name='a_tab_second_item']").parent().parent().parent().parent().parent().show();
        //娓呯┖浜岀骇鑿滃崟鐨勬墍鏈夐€変腑鐘舵€�
        $("a[name='a_tab_second_item']").parent().removeClass("active");
        //璁剧疆浜岀骇鑿滃崟鐨勯€変腑鐘舵€�
        $("a[tab_second_item_id='" + tab_second_item_id + "'][name='a_tab_second_item']").parent().addClass("active");
        //鏄剧ず涓夌骇鑿滃崟
        $('li[tab_perm_item_fid="' + tab_second_item_id + '"][name="li_tab_third_item"]').show();
        //閫変腑涓夌骇鑿滃崟鑿滃崟
        $(this).parent().parent().addClass("active");
        //鏄剧ず鍥涚骇鑿滃崟
        $(this).siblings().show();

        //鍥涚骇鑿滃崟鍘绘帀active
        $('li[name="li_tab_four_item"]').removeClass("active");
        //閫変腑褰撳墠鑿滃崟
        $(this).show().addClass("active");
        var url = $(this).find("a").attr("tab_perm_url");
        if (url) {
            if (index_act) {
                //濡傛灉鏄埛鏂拌繘鏉ョ殑
                location.hash = locationhash;
            } else {
                //鍒囨崲鑿滃崟蹇呴』瑕佹竻绌哄叾浠杊ash鍊�
                Util.setHash("act=" + url);
            }
            sysmenu.showMenu('div_menu_tab');
        }
        event.stopPropagation();
    });



    //绗竴娆″姞杞介〉闈�
    var locationhash = location.hash;
    var index_act = Util.getHash(location.hash, 'act');
    //鍙栧緱閰嶇疆椤甸潰鏄惁寮瑰嚭鏍囧織targettype
    var cpparams = Util.getHash(location.hash, "cpparams", "");
    // 澧炲姞澶栭儴宓屽叆
    if (index_act.indexOf('http://') != -1) {
        index_act = encodeURIComponent(index_act);
    }
    //濡傛灉鏄洿鎺ユ樉绀洪潤鎬佸钩閾鸿彍鍗�
    if (index_act.indexOf("static_show_") != -1) {
        var hash = index_act.substring(12);
        $('a[name="a_tab_second_item"][tab_second_item_id="' + hash + '"]').trigger("click");
        return;
    }

    //濡傛灉鏄钩閾鸿彍鍗曠殑URL
    if ($("a[tab_panel_item=true][item_url='" + index_act + "']").length > 0) {
        var $item_id = $("a[tab_panel_item=true][item_url='" + index_act + "']");
        //娓呯┖tab浜岀骇鑿滃崟鐨勬墍鏈夐€変腑鐘舵€�
        $("a[name='a_tab_second_item']").parent().removeClass("active");
        //灏唗ab鍒涘缓鍒颁簩绾ц彍鍗曚笂
        if (sessionStorage) {
            var tabs = sessionStorage.getItem("secondTabMenu");
            if (tabs) {
                tabs = $.parseJSON(tabs);
                $(tabs).each(function(i, o) {
                    sysmenu.addSecondTab(o.item_id, o.item_url, o.item_name, o.second_item_id, o.item_id == $item_id.attr("item_id"), true);
                });
            }
        }
        //鏄剧ず浜岀骇鑿滃崟
        var second_item_id = $item_id.attr("second_item_id");
        $("a[tab_second_item_id='" + second_item_id + "']").parent().parent().parent().parent().parent().show();
        //閫変腑涓€绾ц彍鍗�
        var tab_first_item_id = $('a[name="a_tab_second_item"][tab_second_item_id="' + second_item_id + '"]').attr("tab_first_item_id");
        $('a[name="first_item_2"][first_item_id="' + tab_first_item_id + '"]').parent().addClass("active bg-act");
        return;
    }

    var targettype = "";
    var parenthash = "";
    var targetact = "";
    if (cpparams != "cpparams" && cpparams != "") {
        cpparams = template.BASE64.decode(cpparams);
        cpparams = JSON.parse(cpparams);
        targettype = cpparams.targettype;
        parenthash = cpparams.parenthash;
        targetact = cpparams.targetact;
        sysmenu.initMenu(index_act);
        if (Util.isNotEmpty(targetact)) {
            index_act = targetact;
        }
    } else {
        sysmenu.initMenu(index_act);
    }
    if (index_act) {
        setTimeout(function() {
            Util.load(index_act, function() {
                index_act = null; //鍒锋柊杩涙潵涔嬪悗灏嗘爣蹇椾綅娓呯┖
                //鍦ㄥ瓙鍒楄〃椤甸潰鐐瑰嚮鍒锋柊锛岃烦鍥炵埗鍒楄〃椤甸潰锛屽幓闄ゅ瓙鍒楄〃鐨刪ash鍙傛暟
                //褰撲笉鍖呭惈cpparams鍙傛暟鏃舵墠甯︿笂hash锛屾垨鑰呭寘鍚玞pparams骞朵笖targettype绛変簬open鏃舵墠甯︿笂hash
                if (locationhash.indexOf("cpparams") < 0 || cpparams == "cpparams") {
                    Util.setHash(locationhash);
                } else if (targettype == "open") {
                    Util.setHash(locationhash);
                }
                if (Util.isNotEmpty(targetact)) {
                    Util.setHash(locationhash);
                }
            }, function() {
                index_act = null; //鍒锋柊杩涙潵涔嬪悗灏嗘爣蹇椾綅娓呯┖
            });
            index_act = null; //鍒锋柊杩涙潵涔嬪悗灏嗘爣蹇椾綅娓呯┖
        }, 500);
    }

});