const group = $env.target_group || "Proxy";
const node = $proxy.getRunningServer(group) || "未连接";

$httpClient.get("http://ip-api.com/json?lang=zh-CN", (err, resp, data) => {
    const ip = err ? "获取失败" : JSON.parse(data).query;
    $done({
        title: group,
        content: `节点: ${node}\nIP: ${ip}`,
        icon: "location.fill"
    });
});
