function formatTime(date) {
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()

  var hour = date.getHours()
  var minute = date.getMinutes()
  var second = date.getSeconds()
  return [year, month, day].map(formatNumber).join('-') + ' ' 
  // return [year, month, day].map(formatNumber).join('-') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

//将数字转为01,03等过程
function formatNumber(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}
function nextWeekTime(){
  var now = new Date();
  var date = new Date(now.getTime() + 7 * 24 * 3600 * 1000);
  var year = date.getFullYear();
  var month = date.getMonth() + 1;
  var day = date.getDate();
  var hour = date.getHours();
  var minute = date.getMinutes();
  var second = date.getSeconds();
  return [year, month, day].map(formatNumber).join('-') + ' ' 
}
// 方法的导出
function a(){
  console.log('a')
}

module.exports = {
  formatTime: formatTime,
  nextWeekTime: nextWeekTime,
  a: a
} 