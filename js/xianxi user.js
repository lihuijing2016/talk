//用户登录和注册的表单项验证的通用代码
/**
 * 对某一个表单项进行验证的构造函数
 */
class FieldValidator {
  /**
   * @param {String} txtId 文本框的Id
   * @param {Function} validatorFunc 验证规则函数，
   * 当需要对该文本框进行验证时，会调用该函数，函数的参数为当前文本框的值，函数的返回值为验证的错误消息，若没有返回，则表示无错误
   */
  constructor(txtId, validatorFunc) {
    //拿到input元素，从而拿到p元素 validatorFunc验证器
    this.input = $("#" + txtId);
    // this.p = this.input.nextElementSibling;
    this.p = this.input.nextElementSibling;
    this.validatorFunc = validatorFunc;
    //这里只验证失去焦点，表单提交在外面验证
    this.input.onblur = () => {
      this.validate();
    };
  }
  /**
   * 验证，成功返回true，失败返回false
   * validate 确认，验证
   */

  //   原型上或实例上的验证方法
  async validate() {
    const err = await this.validatorFunc(this.input.value);
    //拿到用户提交的信息来判断有没有错误
    if (err) {
      this.p.innerText = err;
      return false;
    } else {
      this.p.innerText = "";
      return true;
    }
  }
  /**
   *对传入的所有验证器进行统一的验证，如果所有的验证均通过，则返回true，否则返回false
   * @param  {FieldValidator[]} validates
   */

  //   静态的验证方法
  static async validate(...validates) {
    //先把每一个验证后的结果拿到
    const proms = validates.map((v) => v.validate());
    //得到一个数组results 数组里是true和false组成
    const results = await Promise.all(proms);
    // every方法就是拿true去对比，有一个false就不成功
    return results.every((r) => r);
  }
}

// 原型上调用验证，一个一个单调验证
// var loginIdValidator = new FieldValidator("txtLoginId", async function (val) {
//   if (!val) {
//     return "请填写账号";
//   }
//   //判断验证账号有没有被别人用过
//   const resp = await API.exists(val);
//   if (resp.data) {
//     //账号已存在
//     return "该账号已被占用，请重新选择";
//   }
// });

// var nicknameValidator = new FieldValidator("txtNickname", function (val) {
//   if (!val) {
//     return "请填写昵称";
//   }
// });
