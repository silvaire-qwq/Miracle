export function isUrlOrEmail(text: string) {
  const urlPattern = /\bhttps?:\/\/[^\s]+/i;
  const emailPattern = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/i;
  return urlPattern.test(text) || emailPattern.test(text);
}

function spacing(text: string) {
  if (!text) return text;

  // 跳过 URL 或邮箱
  if (isUrlOrEmail(text)) return text;

  // 中文与英文/数字直接相邻时加空格（只加右边）
  text = text.replace(/([\u4e00-\u9fff])([a-zA-Z0-9])/g, "$1 $2");
  text = text.replace(/([a-zA-Z0-9])([\u4e00-\u9fff])/g, "$1 $2");

  // 中文与英文符号相邻时，只在符号后面加空格
  text = text.replace(
    /([\u4e00-\u9fff])([!@#$%^&*()_+\-=\[\]{};:'",.<>/?\\|`~])([^\s])/g,
    "$1$2 $3",
  );

  // 英文/数字与中文符号相邻时，只在符号后面加空格
  text = text.replace(
    /([a-zA-Z0-9])([!@#$%^&*()_+\-=\[\]{};:'",.<>/?\\|`~])([\u4e00-\u9fff])/g,
    "$1$2 $3",
  );

  return text;
}

// 遍历文本节点并加空格
export function applyPangu(root: HTMLElement = document.body) {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
    acceptNode(node) {
      if (!node.nodeValue?.trim()) return NodeFilter.FILTER_REJECT;

      const parent = node.parentElement;
      if (!parent) return NodeFilter.FILTER_REJECT;

      // 排除不处理的标签
      const skipTags = [
        "SCRIPT",
        "STYLE",
        "CODE",
        "PRE",
        "A",
        "TEXTAREA",
        "INPUT",
      ];
      if (skipTags.includes(parent.tagName)) return NodeFilter.FILTER_REJECT;

      return NodeFilter.FILTER_ACCEPT;
    },
  });

  let node: Node | null;
  while ((node = walker.nextNode())) {
    node.nodeValue = spacing(node.nodeValue!);
  }
}

// 监听动态内容变化
export function observePangu() {
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((m) => {
      m.addedNodes.forEach((n) => {
        if (n.nodeType === Node.TEXT_NODE) {
          n.nodeValue = spacing(n.nodeValue!);
        } else if (n.nodeType === Node.ELEMENT_NODE) {
          applyPangu(n as HTMLElement);
        }
      });
    });
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });
}
