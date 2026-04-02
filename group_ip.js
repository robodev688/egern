/**
 * 核心逻辑：读取 UI 设定的策略组名称 -> 获取活跃节点 -> 查询并显示 IP
 */

async function main() {
    // 1. 从模块 UI 设置中读取用户填写的策略组名
    const groupName = $env.monitor_group_name || "Proxy";

    // 2. 获取该策略组当前选中的节点名称 (Egern API)
    const serverName = $proxy.getRunningServer(groupName);

    if (!serverName) {
        $done({
            title: groupName,
            content: "未找到活跃节点，请检查策略组名称",
            icon: "exclamationmark.triangle",
            "icon-color": "#FF3B30"
        });
        return;
    }

    // 3. 请求 IP 接口 (使用 $httpClient)
    $httpClient.get("http://ip-api.com/json?lang=zh-CN", (error, response, data) => {
        if (error || !data) {
            $done({
                title: groupName,
                content: `节点: ${serverName}\n无法获取 IP 数据`,
                icon: "wifi.exclamationmark"
            });
        } else {
            const info = JSON.parse(data);
            // 4. 返回 Widget 渲染数据
            $done({
                title: `${groupName} ➔ ${serverName}`,
                content: `出口 IP: ${info.query}\n归属: ${info.country} ${info.city}`,
                icon: "location.fill",
                "icon-color": "#34C759"
            });
        }
    });
}

main();
