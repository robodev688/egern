/**
 * Egern 面板脚本：显示策略组当前节点及 IP
 */

async function main() {
  // 1. 获取 UI 控件中设置的策略组名称
  const groupName = $env.target_group;
  
  if (!groupName) {
    $done({
      title: "配置错误",
      content: "请在模块设置中选择策略组",
      icon: "exclamationmark.triangle",
      "icon-color": "#FF0000"
    });
    return;
  }

  // 2. 获取该策略组当前选中的节点名称
  // 使用 Egern API: $proxy.getRunningServer(groupName)
  const serverName = $proxy.getRunningServer(groupName);

  if (!serverName) {
    $done({
      title: groupName,
      content: "未找到活跃节点",
      icon: "bolt.horizontal.slash"
    });
    return;
  }

  // 3. 模拟或获取节点 IP (由于隐私和性能，通常通过查询外部 API 或 DNS)
  // 这里演示通过 http 请求获取该节点出口 IP
  $httpClient.get("http://ip-api.com/json", (error, response, data) => {
    if (error) {
      $done({
        title: groupName,
        content: `节点: ${serverName}\n无法获取 IP`,
      });
    } else {
      const info = JSON.parse(data);
      $done({
        title: `${groupName} -> ${serverName}`,
        content: `出口 IP: ${info.query}\n归属地: ${info.country}`,
        icon: "location.fill",
        "icon-color": "#34C759"
      });
    }
  });
}

main();
