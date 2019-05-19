// const server = "http://192.168.1.106:8080";
const server = "https://api.szpinc.org/invitation";
const info_url = server + "/info";
const side_list_url = server + "/slide_list";
const bless_list_url = server + "/bless/list";
const bless_add_url = server + "/bless/add";
const user_openid_url = server + "/user/openid";
const chat_list_url = server + "/chat/list";
const chat_add_url = server + "/chat/add";
const attend_url = server + "/attend"


module.exports = {
  'info_url': info_url,
  'side_list': side_list_url,
  'chat_list': chat_list_url,
  "bless_list": bless_list_url,
  "bless_add": bless_add_url,
  "user_openid": user_openid_url,
  "chat_list": chat_list_url,
  "chat_add": chat_add_url,
  "attend": attend_url
}