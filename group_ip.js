export default async function (ctx) {
  const groupName = ctx.env.GROUP_NAME || "我的策略组";
  const groupType = ctx.env.GROUP_TYPE || "external";
  const externalType = ctx.env.EXTERNAL_TYPE || "auto_test";
  const policy = ctx.env.POLICY || "";
  const policyUrl = ctx.env.POLICY_URL || "";
  const ipCheckUrl = ctx.env.IP_CHECK_URL || "https://api.ipify.org";
  const title = ctx.env.PANEL_TITLE || "策略组出口 IP";

  const addUrl =
    "egern:/policy_groups/new" +
    `?type=${encodeURIComponent(groupType)}` +
    `&external_type=${encodeURIComponent(externalType)}` +
    `&name=${encodeURIComponent(groupName)}` +
    `&policy=${encodeURIComponent(policy)}` +
    `&url=${encodeURIComponent(policyUrl)}`;

  let ipText = "未获取";
  let infoText = `策略组: ${groupName}`;

  if (ipCheckUrl) {
    try {
      const resp = await ctx.http.get(ipCheckUrl, {
        policy: groupName,
        timeout: 8000,
      });

      const text = (await resp.text()).trim();
      ipText = text || "接口返回为空";

      const ipInfo = ctx.lookupIP(text);
      if (ipInfo) {
        infoText = `${groupName} · ${ipInfo.country} · AS${ipInfo.asn} ${ipInfo.organization}`;
      }
    } catch (e) {
      ipText = "查询失败";
      infoText = `${groupName} · ${String(e)}`;
    }
  }

  return {
    type: "widget",
    padding: 16,
    gap: 8,
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
            text: "添加 / 更新策略组",
            font: { size: "body", weight: "semibold" },
            textColor: "#7EE787"
          },
          {
            type: "text",
            text: `名称: ${groupName}`,
            textColor: "#FFFFFF",
            maxLines: 1,
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
          }
        ]
      }
    ]
  };
}
