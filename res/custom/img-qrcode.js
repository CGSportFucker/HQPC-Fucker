$("head").append("<img />");
$("head").children(":last").attr({
    id: "myLogo",
    style: "display: none",
    src: "../res/origin/img/qr-center-icon.png"
});


var imgQRCode = function(target) {
    this.target = target;
    this.fill = '#3bb265'; //二维码颜色
    this.background = '#ffffff'; //背景颜色
    this.size = 172; //大小
};

imgQRCode.prototype.generateImgQRCode = function(student_num) {
    var obj = this;
    var timestamp = Date.parse(new Date());
    base_image = new Image();
    base_image.src = './res/origin/img/qr-center-icon.png';
    var content = window.btoa("pid=" + student_num + "&timestamp=" + timestamp);
    $("#" + this.target).qrcode({
        render: "canvas", //也可以替换为table
        ecLevel: 'H', //识别度  'L', 'M', 'Q' or 'H'
        size: obj.size, //二维码大小
        fill: obj.fill, //二维码颜色
        background: obj.background, //背景色
        text: content, //二维码内容
        //quiet: 2,                      //边距
        mode: 4,
        mSize: 0.3, //图片大小
        mPosX: 0.5,
        mPosY: 0.5,
        label: 'jQuery.qrcode',
        fontname: 'sans',
        fontcolor: '#000',
        image: base_image,
        typeNumber: -1, //计算模式 
    });
};