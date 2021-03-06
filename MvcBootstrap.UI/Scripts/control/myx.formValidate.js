﻿/// <reference path="jquery-1.8.3.min.js" />
/**
Name    : form验证表单插件
Version : 5.0
Author  : RockyMyx
插件说明:
validationInit：
{
pwdLevel：  密码强度验证等级，数值为1-3，3为最强，即密码需同时拥有数字、字母和特殊字符。
dateMode：  日期格式，共支持两种模式：ymd，即年-月-日，mdy，即月-日-年。间隔符可以为-或者/
success：   表单通过验证后的提示文字
}
validationFunc:   封装了所有表单的验证类型
validationConfig：包含表单的class，提示div的class以及各种提示信息

参数说明 :
tipSweep:         true表示在表单blur时即触发表单验证，反之false
showAllError:     true表示在点击提交按钮时显示所有未通过验证的表单提示信息，反之在检测到第一个错误时即停止检测
tipStyle:         提示文字显示方式：text表示显示文本，title表示显示在标签的title属性中
isInline:         是否内联显示
isHideInit:       是否隐藏表单验证初始样式
tipClass:         提示文字样式
infoClass:        表单提示图标样式
focusClass:       点击表单图标样式
errorClass:       表单验证不通过图标样式
successClass:     表单验证通过图标样式
warnClass:        表单验证警告图标样式
weakClass:        密码强度弱图标样式
midClass:         密码强度中等图标样式
strongClass:      密码强度强图标样式
**/
(function ($) {
    'use strict';

    var validationInit = {
        pwdLevel: 3,
        dateMode: 'ymd',
        success: 'OK'
    };

    var validationFunc = {
        noCheck: function () {
            return true;
        },
        empty: function (value) {
            return value == undefined || value === null || value === '';
        },
        name: function (value) {
            return /^[\w]{6,15}$/.test(value);
        },
        length: function (value, min, max) {
            min = min || 0;
            max = max || Infinity;
            return value.length < min || value.length > max;
        },
        pwd: function (value) {
            return /^.{6,15}$/.test(value);
        },
        pwdLevel: function (value) {
            var charMode = function (c) {
                if (c >= 48 && c <= 57) //数字
                    return 1;
                else if (c >= 65 && c <= 90) //大写字母
                    return 2;
                else if (c >= 97 && c <= 122) //小写
                    return 2;
                else
                    return 4; //特殊字符
            };
            var modes, level = 0;
            for (var i = 0; i < value.length; i++) {
                modes |= charMode(value.charCodeAt(i));
            }
            for (var i = 0; i < 3; i++) {
                if (modes & 1) {
                    level++;
                }
                modes >>>= 1;
            }
            return level;
        },
        familyname: function (realname) {
            var familyNameArr = ['赵', '钱', '孙', '李', '周', '吴', '郑', '王', '冯', '陈', '褚', '卫',
			'蒋', '沈', '韩', '杨', '朱', '秦', '尤', '许', '何', '吕', '施', '张', '孔',
			'曹', '严', '华', '金', '魏', '陶', '姜', '戚', '谢', '邹', '喻', '柏', '水',
			'窦', '章', '云', '苏', '潘', '葛', '奚', '范', '彭', '郎', '鲁', '韦', '昌',
			'马', '苗', '凤', '花', '方', '俞', '任', '袁', '柳', '酆', '鲍', '史', '唐',
			'费', '廉', '岑', '薛', '雷', '贺', '倪', '汤', '滕', '殷', '罗', '毕', '郝',
			'邬', '安', '常', '乐', '于', '时', '傅', '皮', '卞', '齐', '康', '伍', '余',
			'元', '卜', '顾', '孟', '平', '黄', '和', '穆', '萧', '尹', '姚', '邵', '堪',
			'汪', '祁', '毛', '禹', '狄', '米', '贝', '明', '臧', '计', '伏', '成', '戴',
			'谈', '宋', '茅', '庞', '熊', '纪', '舒', '屈', '项', '祝', '董', '粱', '杜',
			'阮', '蓝', '闵', '席', '季', '麻', '强', '贾', '路', '娄', '危', '江', '童',
			'颜', '郭', '梅', '盛', '林', '刁', '钟', '徐', '邱', '骆', '高', '夏', '蔡',
			'田', '樊', '胡', '凌', '霍', '虞', '万', '支', '柯', '咎', '管', '卢', '莫',
			'经', '房', '裘', '缪', '干', '解', '应', '宗', '宣', '丁', '贲', '邓', '郁',
			'单', '杭', '洪', '包', '诸', '左', '石', '崔', '吉', '钮', '龚', '程', '嵇',
			'邢', '滑', '裴', '陆', '荣', '翁', '荀', '羊', '於', '惠', '甄', '魏', '加',
			'封', '芮', '羿', '储', '靳', '汲', '邴', '糜', '松', '井', '段', '富', '巫',
			'乌', '焦', '巴', '弓', '牧', '隗', '山', '谷', '车', '侯', '宓', '蓬', '全',
			'郗', '班', '仰', '秋', '仲', '伊', '宫', '宁', '仇', '栾', '暴', '甘', '钭',
			'厉', '戎', '祖', '武', '符', '刘', '姜', '詹', '束', '龙', '叶', '幸', '司',
			'韶', '郜', '黎', '蓟', '薄', '印', '宿', '白', '怀', '蒲', '台', '从', '鄂',
			'索', '咸', '籍', '赖', '卓', '蔺', '屠', '蒙', '池', '乔', '阴', '郁', '胥',
			'能', '苍', '双', '闻', '莘', '党', '翟', '谭', '贡', '劳', '逄', '姬', '申',
			'扶', '堵', '冉', '宰', '郦', '雍', '郤', '璩', '桑', '桂', '濮', '牛', '寿',
			'通', '边', '扈', '燕', '冀', '郏', '浦', '尚', '农', '温', '别', '庄', '晏',
			'柴', '瞿', '阎', '充', '慕', '连', '茹', '习', '宦', '艾', '鱼', '容', '向',
			'古', '易', '慎', '戈', '廖', '庚', '终', '暨', '居', '衡', '步', '都', '耿',
			'满', '弘', '匡', '国', '文', '寇', '广', '禄', '阙', '东', '殴', '殳', '沃',
			'利', '蔚', '越', '夔', '隆', '师', '巩', '厍', '聂', '晁', '勾', '敖', '融',
			'冷', '辛', '阚', '那', '简', '饶', '空', '曾', '毋', '沙', '乜', '养', '鞠',
			'须', '丰', '巢', '关', '蒯', '相', '查', '后', '江', '红', '游', '竺', '权',
			'逯', '盖', '益', '桓', '公', '万', '俟', '司', '马', '上', '官', '欧', '阳',
			'夏', '侯', '诸', '葛', '闻', '人', '东', '方', '赫', '连', '皇', '甫', '尉',
			'迟', '公', '羊', '澹', '台', '公', '冶', '宗', '政', '濮', '阳', '淳', '于',
			'仲', '孙', '太', '叔', '申', '屠', '公', '孙', '乐', '正', '轩', '辕', '令',
			'狐', '钟', '离', '闾', '丘', '长', '孙', '慕', '容', '鲜', '于', '宇', '文',
			'司', '徒', '司', '空'];
            return familyNameArr.indexOf(realname.substr(0, 1)) == -1;
        },
        email: function (value) {
            return /^([-_A-Za-z0-9\.]+)@([_A-Za-z0-9]+\.)+[A-Za-z0-9]{2,3}$/.test($.trim(value));
        },
        date: function (value, separator) {
            value = $.trim(value);
            if (value.length == 0) return false;
            //年月日之间的分隔符，现只支持为'-'或'/'
            if (validationInit.dateMode == 'ymd') {
                if (separator == '/') {
                    var reg = /^(1|2)([\d]){3}\/[\d]{2}\/[\d]{2}/;
                    if (!reg.test(value)) return false;
                } else {
                    var reg = /^(1|2)([\d]){3}-[\d]{2}-[\d]{2}/;
                    if (!reg.test(value)) return false;
                }
            } else if (validationInit.dateMode == 'mdy') {
                if (separator == '/') {
                    var reg = /^[\d]{2}\/[\d]{2}\/(1|2)([\d]){3}/;
                    if (!reg.test(value)) return false;
                } else {
                    var reg = /^[\d]{2}-[\d]{2}-(1|2)([\d]){3}/;
                    if (!reg.test(value)) return false;
                }
            }
            var formatDate = value.replace(/(-|\/)/g, '');
            var year = formatDate.substr(0, 4),
                month = formatDate.substr(4, 2),
                day = formatDate.substr(6, 2);
            return checkDate(year, month, day);
        },
        digit: function (value) {
            return $.isNumeric($.trim(value));
        },
        integer: function (value) {
            return /^-?[1-9]\d*$/.test($.trim(value));
        },
        letter: function (value) {
            return /^[A-Za-z]+$/.test($.trim(value));
        },
        chinese: function (value) {
            var len = value.length,
                value = $.trim(value);
            for (var i = 0; i < len; i++) {
                if (value.charCodeAt(i) < 255)
                    return false;
            }
            return true;
        },
        age: function (value) {
            return this.integer(value) && (parseInt(value) > 0 || parseInt(value) < 150);
        },
        phone: function (value) {
            return /^(([0\+]\\d{2,3}-)?(0\d{2,3})-)?(\d{7,8})(-(\d{3,}))?$/.test($.trim(value));
        },
        mobile: function (value) {
            return /^(13|14|15|18)[0-9]{9}$/.test($.trim(value));
        },
        qq: function (value) {
            return /^[1-9]\d{4,9}$/.test($.trim(value));
        },
        cid: function (value) {
            value = $.trim(value.toUpperCase());
            if (!(/(^\d{15}$)|(^\d{17}([0-9]|X)$)/.test(value))) return false;

            var len = value.length;
            var reg;
            var year, month, day;
            if (len == 15) {
                reg = new RegExp(/^(\d{6})(\d{2})(\d{2})(\d{2})(\d{3})$/);
                var arrSplit = value.match(reg);

                var year = '19' + arrSplit[2],
                    month = arrSplit[3],
                    day = arrSplit[4];
                if (!checkDate(year, month, day)) {
                    return false;
                } else {
                    //将15位身份证转成18位
                    return value.substr(0, 6) + '19' + value.substr(6, 9) + 'X';
                }
            }
            if (len == 18) {
                reg = new RegExp(/^(\d{6})(\d{4})(\d{2})(\d{2})(\d{3})([0-9]|X)$/);
                var arrSplit = value.match(reg);

                var year = arrSplit[2],
                    month = arrSplit[3],
                    day = arrSplit[4];
                if (!checkDate(year, month, day))
                    return false;
                else {
                    //校验位按照ISO 7064:1983.MOD 11-2的规定生成，X可以认为是数字10。
                    var arrInt = new Array(7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2);
                    var arrCh = new Array('1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2');
                    var temp = 0,
                        i;
                    for (i = 0; i < 17; i++) {
                        temp += value[i] * arrInt[i];
                    }
                    if (arrCh[temp % 11] != value.substr(17, 1)) {
                        return false;
                    }
                }
            }
            return true;
        },
        compress: function (value) {
            return /(.+)\.(rar|zip|tgz|7zip|7z)$/.test($.trim(value));
        },
        pic: function (value) {
            return /(.+)\.(jpg|jpeg|gif|png|ico)/.test($.trim(value));
        },
        url: function (value) {
            return /(https?|ftp|mms):\/\/([A-z0-9]+[_\-]?[A-z0-9]+\.)*[A-z0-9]+\-?[A-z0-9]+\.[A-z]{2,}(\/.*)*\/?/.test($.trim(value));
        }
    };

    var validationConfig = {
        empty: {
            init: '请输入信息',
            focus: '此处不可为空',
            empty: '此处不可为空，请输入信息！'
        },
        name: {
            init: '请输入用户名',
            focus: '用户名长度在6到15位之间,且只能由字母、数字和_组成',
            empty: '用户名不得为空',
            length: '用户名长度在6到15位之间，请检查后重新输入',
            name: '用户名只能由字母、数字和_组成，请检查后重新输入',
            min: 6,
            max: 15
        },
        pwd: {
            init: '请输入密码',
            focus: '密码由数字、字母或特殊字符组成',
            empty: '密码不得为空',
            length: '密码长度在6到15位之间，请检查后重新输入',
            pwd: '密码长度在6到15位之间，请检查后重新输入',
            min: 6,
            max: 15,
            pwdLevelTip: 'pwdLevelTip',
            weak: '弱',
            middle: '中等',
            strong: '强',
            weakLevel: '密码强度很弱，建议重新设置',
            middleLevel: '密码强度较弱，可以进一步增强',
            strongLevel: '密码强度好，请记牢'
        },
        confirmPwd: {
            init: '请输入确认密码',
            focus: '请输入确认密码',
            empty: '确认密码不得为空',
            compare: '两次输入的密码不一致，请检查后重新输入',
            compareTo: '.pwd'
        },
        email: {
            init: '请输入邮箱',
            focus: '请输入您的邮箱',
            empty: '邮箱不得为空',
            email: '邮箱输入格式有误，请检查后重新输入'
        },
        date: {
            init: '请输入日期',
            focus: '请输入正确的日期格式(yyyy-mm-dd)',
            empty: '日期不得为空',
            date: '输入的日期格式不正确，请检查后重新输入'
        },
        age: {
            init: '请输入年龄',
            focus: '请输入年龄',
            empty: '年龄不得为空',
            age: '请输入0-150之间的整数',
            min: 0,
            max: 150
        },
        cid: {
            init: '请输入身份证号',
            focus: '请输入15或18位身份证号',
            empty: '身份证不得为空',
            cid: '不是有效的身份证号，请检查后重新输入'
        },
        mobile: {
            init: '请输入手机号',
            focus: '请输入您的手机号',
            empty: '手机号不得为空',
            mobile: '手机号输入错误，请检查后重新输入'
        },
        phone: {
            init: '请输入座机电话',
            focus: '请输入您的座机电话',
            empty: '座机电话不得为空',
            phone: '座机电话输入错误，请检查后重新输入'
        },
        url: {
            init: '请填写您的个人主页',
            focus: '个人网站、空间、博客均可',
            empty: '个人主页不得为空',
            url: '个人主页输入格式有误，请检查后重新输入'
        },
        letter: {
            init: '请输入英文字母',
            focus: '请输入纯英文字母',
            empty: '此处不得为空',
            letter: '您输入了非法字符，请检查后重新输入'
        },
        digit: {
            init: '请输入数字',
            focus: '请输入纯数字',
            empty: '此处不得为空',
            digit: '您输入了非法字符，请检查后重新输入'
        },
        chinese: {
            init: '请输入中文',
            focus: '请输入纯中文',
            empty: '此处不得为空',
            chinese: '您输入了非法字符，请检查后重新输入'
        }
    };

    $.fn.mValidate = function (options) {
        var settings = {
            init: validationInit,
            func: validationFunc,
            config: validationConfig,
            tipSweep: true,
            showAllError: true,
            isInline: false,
            isHideInit: false,
            tipStyle: 'text',
            tipClass: '.form-tip',
            initClass: 'form-init',
            focusClass: 'form-focus',
            warnClass: 'form-warn',
            errorClass: 'form-error',
            successClass: 'form-success',
            weakClass: 'form-pwd-weak',
            midClass: 'form-pwd-mid',
            strongClass: 'form-pwd-strong'
        };

        $.extend(settings, options || {});

        /*************************Helpers*******************************/

        $.fn.showTip = function (info) {
            if (settings.tipStyle == 'text') {
                this.html(info);
            } else if (settings.tipStyle == 'title') {
                this.attr('title', info);
            }
        };

        $.fn.showInit = function (info) {
            this.next()
                .removeClass(settings.successClass)
                .removeClass(settings.errorClass)
                .addClass(settings.initClass)
                .showTip(info);
        };

        $.fn.showFocus = function (info) {
            this.next()
                .removeClass(settings.initClass)
                .removeClass(settings.successClass)
                .removeClass(settings.errorClass)
                .addClass(settings.focusClass)
                .showTip(info);
        };

        $.fn.showError = function (info) {
            this.next()
                .removeClass(settings.initClass)
                .removeClass(settings.successClass)
                .addClass(settings.errorClass)
                .showTip(info);
        };

        $.fn.showSuccess = function (info) {
            this.next()
                .removeClass(settings.initClass)
                .removeClass(settings.errorClass)
                .addClass(settings.successClass)
                .showTip(info);
        };

        $.fn.showHide = function (info, showClass, hideClass) {
            this.removeClass(settings.initClass)
                .removeClass(hideClass)
                .addClass(showClass)
                .showTip(info);
        };

        $.fn.showOnly = function (info, showClass) {
            this.removeClass(settings.successClass)
                .removeClass(settings.errorClass)
                .removeClass(settings.focusClass)
                .removeClass(settings.initClass)
                .addClass(showClass)
                .showTip(info);
        };

        $.fn.hideOnly = function (info, hideClas) {
            this.removeClass(hideClas)
                .showTip(info);
        };

        Array.prototype.contains = function () {
            for (var i = 0; i < this.length; i++) {
                if (this[i] == arguments[0]) {
                    return true;
                }
            }
            return false;
        };

        String.prototype.equal = function (str2) {
            return this.localeCompare(str2) == 0;
        };

        /***************************************************************/

        if (settings.tipStyle == 'title') {
            $(settings.tipClass).css({ 'height': '20px', 'vertical-align': 'middle' });
        }

        if (settings.isInline) {
            $(settings.tipClass).css({ 'display': 'inline', 'padding-top': '4px' });
        }

        var controls = $(this).find('select, input:text');
        var control;
        for (var i = 0; i < controls.length; i++) {
            control = controls.eq(i);
            if (control.is('select')) {
                if (!control.hasClass('noCheck')) {
                    control.parent().find(settings.tipClass).showOnly('请选择', settings.initClass);
                } else {
                    control.parent().find(settings.tipClass).addClass(settings.successClass);
                }
            } else {
                if (!settings.isHideInit) {
                    if (control.attr('class') != undefined) {
                        valType = control.attr('class').split(' ');
                        if (!valType.contains('hide') && control.val().length == 0 && settings.config[valType[0]] != undefined) {
                            control.next().showOnly(settings.config[valType[0]]['init'], settings.initClass);
                        }
                    }
                } else {
                    control.next().showOnly('', settings.successClass);
                }
            }
        }

        var selects = $(this).find('select');

        selects.on('change blur', function () {
            var tipSelect = $(this).parent().find(settings.tipClass);
            if (!$(this).hasClass('noCheck')) {
                if (this.selectedIndex == 0) {
                    tipSelect.showHide('请选择内容', settings.errorClass, settings.successClass);
                } else {
                    tipSelect.showHide(settings.init.success, settings.successClass, settings.errorClass);
                }
            }
        });

        var inputs = $(this).find('input');
        var valType;

        inputs.on('focus', function () {
            if ($(this).attr('class') != undefined) {
                valType = $(this).attr('class').split(' ')[0];
                if (settings.config[valType] != undefined &&
                   (settings.func.empty(this.value) || $(this).next().hasClass(settings.errorClass))) {
                    $(this).showFocus(settings.config[valType].focus);
                }
            }
        });

        if (settings.tipSweep) {
            inputs.on('blur', function () {
                var value = $(this).val();
                if (settings.config[valType] != undefined) {
                    if (settings.config[valType].empty && settings.func.empty(value)) {
                        $(this).showError(settings.config[valType]['empty']);
                    } else if (settings.config[valType].length &&
                        settings.func.length(value, settings.config[valType]['min'], settings.config[valType]['max'])) {
                        $(this).showError(settings.config[valType]['length']);
                    } else if (settings.config[valType].name && !settings.func.name(value)) {
                        $(this).showError(settings.config[valType]['name']);
                    } else if (settings.config[valType].pwd && !settings.func.pwd(value)) {
                        $(this).showError(settings.config[valType]['pwd']);
                    } else if (settings.config[valType].pwdLevelTip) {
                        var result = settings.func.pwdLevel(value);
                        var pwdLevelClass = settings.config[valType].pwdLevelTip;
                        if (result == 1) {
                            $('.' + pwdLevelClass).attr('class', pwdLevelClass + ' ' + settings.weakClass);
                            $(this).showSuccess(settings.config[valType]['weakLevel'], settings.warnClass);
                        } else if (result == 2) {
                            $('.' + pwdLevelClass).attr('class', pwdLevelClass + ' ' + settings.midClass);
                            $(this).showSuccess(settings.config[valType]['middleLevel'], settings.warnClass);
                        } else {
                            $('.' + pwdLevelClass).attr('class', pwdLevelClass + ' ' + settings.strongClass);
                            $(this).showSuccess(settings.config[valType]['strongLevel'], settings.successClass);
                        }
                    } else if (settings.config[valType].compare &&
                        settings.config[valType].compareTo && !$(settings.config[valType].compareTo).val().equal(value)) {
                        $(this).showError(settings.config[valType]['compare']);
                    } else if (settings.config[valType].date && !settings.func.date(value, '-')) {
                        $(this).showError(settings.config[valType]['date']);
                    } else if (settings.config[valType].age &&
                    (!settings.func.digit(value) ||
                        parseInt(value) < settings.config[valType].min ||
                        parseInt(value) > settings.config[valType].max)) {
                        $(this).showError(settings.config[valType]['age']);
                    } else if (settings.config[valType].cid && !settings.func.cid(value)) {
                        $(this).showError(settings.config[valType]['cid']);
                    } else if (settings.config[valType].mobile && !settings.func.mobile(value)) {
                        $(this).showError(settings.config[valType]['mobile']);
                    } else if (settings.config[valType].phone && !settings.func.phone(value)) {
                        $(this).showError(settings.config[valType]['phone']);
                    } else if (settings.config[valType].email && !settings.func.email(value)) {
                        $(this).showError(settings.config[valType]['email']);
                    } else if (settings.config[valType].url && !settings.func.url(value)) {
                        $(this).showError(settings.config[valType]['url']);
                    } else if (settings.config[valType].letter && !settings.func.letter(value)) {
                        $(this).showError(settings.config[valType]['letter']);
                    } else if (settings.config[valType].digit && !settings.func.digit(value)) {
                        $(this).showError(settings.config[valType]['digit']);
                    } else if (settings.config[valType].chinese && !settings.func.chinese(value)) {
                        $(this).showError(settings.config[valType]['chinese']);
                    } else {
                        $(this).showSuccess(settings.init.success);
                    }
                }
            });
        }

        $(this).find('input[type=submit]').on('click', function () {
            var isValid = 1;
            for (var i = 0; i < controls.length; i++) {
                control = controls.eq(i);
                if (control.is('select')) {
                    if (control.hasClass('noCheck')) {
                        control.hideOnly('', settings.initClass);
                    } else {
                        var tipSelect = control.parent().find(settings.tipClass);
                        if (tipSelect.hasClass(settings.initClass)) {
                            tipSelect.showHide('请选择', settings.errorClass, settings.successClass);
                            if (!settings.showAllError) {
                                return false;
                            }
                            else {
                                isValid = 0;
                            }
                        }
                    }
                } else {
                    if (control.attr('class') != undefined) {
                        valType = control.attr('class').split(' ')[0];
                        if (settings.config[valType] != undefined &&
                            control.next().hasClass(settings.initClass)) {
                            control.next().showHide(settings.config[valType]['init'], settings.errorClass, settings.successClass);
                            if (!settings.showAllError) {
                                return false;
                            }
                            else {
                                isValid = 0;
                            }
                        }
                    }
                }
            }

            return isValid == 0 ? false : true;
        });
    };
})(jQuery);

function checkDate(year, month, day) {
    if (year.length != 4 || month.length != 2 || day.length != 2)
        return false;
    if (parseInt(month, 10) <= 0 ||
                parseInt(month, 10) > 12 ||
                parseInt(day, 10) <= 0 ||
                parseInt(day, 10) > 31) {
        return false;
    }
    if ((year % 4 == 0 && year % 100 != 0) || year % 400 == 0) {
        //闰年2月不可大于29天
        if (parseInt(month, 10) == 2) return parseInt(day, 10) <= 29;
    } else {
        //平年2月不可大于28天
        if (parseInt(month, 10) == 2) return parseInt(day, 10) <= 28;
    }
    var monthArr = [1, 3, 5, 7, 8, 10, 12];
    for (var i = 0; i < monthArr.length; i++) {
        if (monthArr[i] == parseInt(month, 10)) {
            //大月天数不可大于31
            return parseInt(day, 10) <= 31;
        } else {
            //小月天数不可大于30
            return parseInt(day, 10) <= 30;
        }
    }
    return true;
};