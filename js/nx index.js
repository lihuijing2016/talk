(async function () {
  // /验证是否有登陆。如果没登录，跳转到登录页面
  //请求拿到当前登录的信息。用code判断有没有登录
  const resp = await API.profile();
  const user = resp.data;
  if (!user) {
    //未登录
    alert("未登录或登录已过期，请重新登录");
    location.href = "./login.html";
    return;
  }

  const doms = {
    aside: {
      nickname: $("#nickname"),
      loginId: $("#loginId"),
    },
    close: $(".close"),
    chatContainer: $(".chat-container"),
    //获取聊天文本框dom
    txtMsg: $("#txtMsg"),
    //表单的提交事件dom
    msgContainer: $(".msg-container"),
  };
  setUserInfo();

  //以下就是登录状态

  //注销事件 点击叉关闭登录
  doms.close.onclick = function () {
    API.loginOut();
    location.href = "./login.html";
  };

  //加载历史记录
  await loadHistory();
  async function loadHistory() {
    const resp = await API.getHistory();
    //循环每一个信息对象，把它添加到创造消息方法中
    for (const item of resp.data) {
      addChat(item);
    }
    scrollBottom();
  }

  //发送消息事件
  doms.msgContainer.onsubmit = function (e) {
    //阻止表单默认提交
    e.preventDefault();
    sendChat();
  };

  //设置用户信息
  function setUserInfo() {
    doms.aside.nickname.innerText = user.nickname;
    doms.aside.loginId.innerText = user.loginId;
  }

  //   发送的消息就是一个对象样的信息。然后添加到页面中
  //     content:"你几岁了？"
  //     createdAt:"1651213093992"
  //     from:"lilili"
  //     to:"null"

  //添加消息的方法
  function addChat(chatInfo) {
    //创建一个div,添加上样式
    const div = $$$("div");
    div.classList.add("chat-item");
    // 判断是我发的消息还是机器人发的
    if (chatInfo.from) {
      div.classList.add("me");
    }
    // 创建头像，判断头像图片地址，人用的和机器人用的不一样
    const img = $$$("img");
    img.className = "chat-avatar";
    img.src = chatInfo.from ? "./asset/avatar.png" : "./asset/robot-avatar.jpg";

    //创建消息内容
    const content = $$$("div");
    content.className = "chat-content";
    content.innerText = chatInfo.content;

    //创建发送消息后的时间
    const date = $$$("div");
    date.className = "chat-date";
    // 用函数formatDate 把chatInfo.createdAt时间转换成xx年xx月日xx:xx:
    date.innerText = formatDate(chatInfo.createdAt);
    div.appendChild(img);
    div.appendChild(content);
    div.appendChild(date);
    doms.chatContainer.appendChild(div);
  }

  //让聊天区域的滚动条滚动到底
  function scrollBottom() {
    doms.chatContainer.scrollTop = doms.chatContainer.scrollHeight;
  }
  //改变时间格式
  function formatDate(timestamp) {
    // 创建一个时间
    const date = new Date(timestamp);
    const year = date.getFullYear(); //年
    //月份从0开始，不足10以上的前面要补“0”，因为是两位数
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    const hour = date.getHours().toString().padStart(2, "0");
    const minute = date.getMinutes().toString().padStart(2, "0");
    const second = date.getSeconds().toString().padStart(2, "0");

    return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
  }
  //设置发送消息按钮
  async function sendChat() {
    // 拿到文本框里的值，用trim去掉首尾空格
    const content = doms.txtMsg.value.trim();
    //如果没有内容，就啥都不做
    if (!content) {
      return;
    }
    // 为了避免用户体验不好，可以先使页面上
    // 出现聊天要发的消息，在等服务端接收， 也就是
    // 加载完成的样子，这样可以让用户感觉页面不会卡
    addChat({
      from: user.loginId,
      to: null,
      //获取当前日期
      createdAt: Date.now(),
      content,
    });
    //显示消息发出去后就清空文本框
    doms.txtMsg.value = "";
    //滑动条在最底部
    scrollBottom();
    const resp = await API.sendChat(content);
    addChat({
      from: null,
      to: user.loginId,
      ...resp.data,
    });
    scrollBottom();
    console.log(resp);
  }
  window.sendChat = sendChat;
})();
