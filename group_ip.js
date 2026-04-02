export default async function (ctx) {
  const rawGroupName = (ctx.env.GROUP_NAME || "").trim();
  const policyName = rawGroupName || "PROXY";
  const ipCheckUrl = (ctx.env.IP_CHECK_URL || "https://api.ipify.org").trim();
  const title = (ctx.env.PANEL_TITLE || "策略组出口 IP").trim();

  const addUrl =
    "egern:/policy_groups/new" +
    `?type=${encodeURIComponent("external")}` +
    `&external_type=${encodeURIComponent("auto_test")}` +
    `&name=${encodeURIComponent(rawGroupName || "MyProxyGroup")}`;

  let ipText = "未获取";
  let infoText = rawGroupName
    ? `策略组: ${rawGroupName}`
    : "默认代理: PROXY";

  let sourceText = `检测接口: ${ipCheckUrl}`;

  try {
    const resp = await ctx.http.get(ipCheckUrl, {
      policy: policyName,
      timeout: 8000,
    });

    const text = (await resp.text()).trim();
    ipText = text || "接口返回为空";

    const ipInfo = ctx.lookupIP(ipText);
    if (ipInfo) {
      infoText = rawGroupName
        ? `${rawGroupName} · ${ipInfo.country} · AS${ipInfo.asn} ${ipInfo.organization}`
        : `PROXY · ${ipInfo.country} · AS${ipInfo.asn} ${ipInfo.organization}`;
    }
  } catch (e) {
    ipText = "查询失败";
    infoText = rawGroupName
      ? `${rawGroupName} · ${String(e)}`
      : `PROXY · ${String(e)}`;
  }

  return {
    type: "widget",
    padding: 16,
    gap: 10,
    backgroundColor: "#1C1C1E",
    children: [
      {
        type: "text",
        text: title,
        font: { size: "headline", weight: "bold" },
        textColor: "#FFFFFF"
      },
      {
        type: "stack",
        direction: "column",
        gap: 4,
        padding: 12,
        backgroundColor: "#2C2C2E",
        borderRadius: 12,
        url: addUrl,
        children: [
          {
            type: "text",
            text: "添加策略组",
            font: { size: "body", weight: "semibold" },
            textColor: "#7EE787"
          },
          {
            type: "text",
            text: rawGroupName
              ? `当前策略组: ${rawGroupName}`
              : "当前策略组: 未设置，使用 PROXY",
            textColor: "#FFFFFF",
            maxLines: 2,
            minScale: 0.7
          }
        ]
      },
      {
        type: "stack",
        direction: "column",
        gap: 4,
        padding: 12,
        backgroundColor: "#2C2C2E",
        borderRadius: 12,
        children: [
          {
            type: "text",
            text: "出口 IP",
            font: { size: "body", weight: "semibold" },
            textColor: "#FFFFFF"
          },
          {
            type: "text",
            text: ipText,
            font: { size: "title3", weight: "bold" },
            textColor: "#FFD166",
            maxLines: 1,
            minScale: 0.5
          },
          {
            type: "text",
            text: infoText,
            textColor: "#C7C7CC",
            maxLines: 2,
            minScale: 0.6
          },
          {
            type: "text",
            text: sourceText,
            textColor: "#8E8E93",
            maxLines: 2,
            minScale: 0.6
          }
        ]
      }
    ]
  };
}
