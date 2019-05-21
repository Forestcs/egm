import Taro from "@tarojs/taro";
import { url, toEncryption } from "./util";

export default options => {
  toEncryption(options.data);
  return Taro.request({
    url: url + options.url,
    data: options.data,
    header: {
      "Content-Type": "application/json"
    },
    method: "POST"
  }).then(res => {
    const { statusCode, data } = res;
    if (statusCode >= 200 && statusCode < 300) {
      if (data.msg != "OK") {
        Taro.showToast({
          title: data.msg,
          icon: "none",
          mask: true
        });
      }
      return data;
    } else {
      throw new Error(`网络请求错误，状态码${statusCode}`);
    }
  });
};
