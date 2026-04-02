/**
 * 逻辑：读取 env 变量 -> 获取策略组当前节点 -> 请求 IP 接口 -> 返回面板数据
 */

async function main() {
  // 1. 读取模块 UI 中填写的策略组名称
  const targetGroup = $env.monitor_group;

  if (!targetGroup) {
    $done({ title: "配置错误", content: "请先在模块设置中填写策略组名称", icon: "warn" });
    return;
  }

  // 2. 获取该策略组当前正在运行的节点名 (Egern API)
  const currentNode = $proxy.getRunningServer(targetGroup);

  if (!currentNode) {
    $done({ title: targetGroup, content: "未找到活跃节点", icon: "bolt.slash" });
    return;
  }

  // 3. 发起请求获取出口 IP
  $httpClient.get("http://ip-api.com/json?lang=zh-CN", (error, response, data) => {
    if (error || !data) {
      $done({
        title: `策略组: ${targetGroup}`,
        content: `节点: ${currentNode}\nIP 获取失败`,
        icon: "wifi.exclamationmark"
      });
    } else {
      const info = JSON.parse(data);
      // 4. 将结果推送到 Egern 面板
      $done({
        title: `策略组: ${targetGroup}`,
        content: `节点: ${currentNode}\n出口IP: ${info.query}\n归属: ${info.country} ${info.city}`,
        icon: "location.fill",
        "icon-color": "#34C759"
      });
    }
  });
}

main();
