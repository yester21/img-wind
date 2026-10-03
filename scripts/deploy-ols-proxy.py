# imgtools.seos.kr vhost에 Node 프록시 + https 강제 리다이렉트 추가 (멱등)
import re

P = "/usr/local/lsws/conf/vhosts/imgtools.seos.kr/vhost.conf"
DOMAIN = "imgtools.seos.kr"

s = open(P).read()

if "imgtools-app" not in s:
    block = (
        "\nextprocessor imgtools-app {\n"
        "  type                    proxy\n"
        "  address                 127.0.0.1:3200\n"
        "  maxConns                100\n"
        "  initTimeout             60\n"
        "  retryTimeout            0\n"
        "  respBuffer              0\n"
        "}\n"
        "\n"
        "context / {\n"
        "  type                    proxy\n"
        "  handler                 imgtools-app\n"
        "  addDefaultCharset       off\n"
        "}\n"
    )
    if "\nvhssl  {" in s:
        s = s.replace("\nvhssl  {", block + "\nvhssl  {", 1)
        print("proxy block: inserted before vhssl")
    else:
        s = s + block
        print("proxy block: appended at end (vhssl not found)")
else:
    print("proxy block: already present")

if "RewriteCond %{SERVER_PORT}" not in s:
    rules = (
        "  rules                   <<<EOR\n"
        "RewriteCond %{SERVER_PORT} ^80$\n"
        f"RewriteRule ^(.*)$ https://{DOMAIN}/$1 [R=301,L]\n"
        "EOR\n"
    )
    s2, n = re.subn(
        r"(rewrite  \{\n\s*enable\s+1\n\s*autoLoadHtaccess\s+1\n)",
        lambda m: m.group(1) + rules,
        s,
        count=1,
    )
    if n == 1:
        s = s2
        print("https redirect: added to rewrite block")
    else:
        print("WARN: rewrite block pattern not found — https redirect NOT added")
else:
    print("https redirect: already present")

open(P, "w").write(s)
print("saved", P)
