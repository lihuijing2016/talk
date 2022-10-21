const loginIdValidator = new FieldValidator("txtLoginId", async function (val) {
  if (!val) {
    return "请填写账号";
  }
});

const loginPwdValidator = new FieldValidator("txtLoginPwd", function (val) {
  if (!val) {
    return "请填写密码";
  }
});

const form = $(".user-form");
form.onsubmit = async function (e) {
  //阻止表单自动提交的默认事件
  e.preventDefault();
  //用静态方法同时验证，即点一键提交
  const result = await FieldValidator.validate(
    loginIdValidator,

    loginPwdValidator
  );
  //提交失败
  if (!result) {
    return;
  }
  //浏览器自带的方法，指传入表单dom，得到一个表单数据对象
  const formData = new FormData(form);
  const data = Object.fromEntries(formData.entries());
  //data就是一个对象，就是用户密码和id等

  const resp = await API.login(data);
  if (resp.code === 0) {
    alert("登录成功,点击确定，跳转首页");
    //页面跳转到登录页面
    location.href = "./index.html";
  } else {
    // alert("登陆失败，请检查账号和密码");亦可以改p的值，如下：
    loginIdValidator.p.innerText = "账号或密码错误";
    loginPwdValidator.input.value = "";
  }
};
