const loginIdValidator = new FieldValidator("txtLoginId", async function (val) {
  if (!val) {
    return "请填写账号";
  }
  //判断验证账号有没有被别人用过
  const resp = await API.exists(val);
  if (resp.data) {
    //账号已存在
    return "该账号已被占用，请重新选择";
  }
});

const nicknameValidator = new FieldValidator("txtNickname", function (val) {
  if (!val) {
    return "请填写昵称";
  }
});
const loginPwdValidator = new FieldValidator("txtLoginPwd", function (val) {
  if (!val) {
    return "请填写密码";
  }
});
const loginPwdConfirmValidator = new FieldValidator(
  "txtLoginPwdConfirm",
  function (val) {
    if (!val) {
      return "请填写确认密码";
    }
    if (val !== loginPwdValidator.input.value) {
      return "两次密码不一致";
    }
  }
);
const form = $(".user-form");
form.onsubmit = async function (e) {
  //阻止表单自动提交的默认事件
  e.preventDefault();
  //用静态方法同时验证，即点一键提交
  const result = await FieldValidator.validate(
    loginIdValidator,
    nicknameValidator,
    loginPwdValidator,
    loginPwdConfirmValidator
  );
  //提交失败
  if (!result) {
    return;
  }
  //浏览器自带的方法，指传入表单dom，得到一个表单数据对象
  const formData = new FormData(form);
  const data = Object.fromEntries(formData.entries());
  //data就是一个对象，就是用户密码和id等

  const resp = await API.reg(data);
  if (resp.code === 0) {
    alert("注册成功,点击确定，跳转登录页面");
    //页面跳转到登录页面
    location.href = "./login.html";
  }
};
