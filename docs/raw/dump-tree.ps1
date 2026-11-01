param(
  [string]$In,
  [string]$Out,
  [string]$Start = "brx-content",
  [switch]$FullBody
)

$html = [System.IO.File]::ReadAllText($In, [System.Text.UTF8Encoding]::new($false))

if (-not $FullBody) {
  # cut from the element that carries the Start id to the matching close (use </main> if present)
  $s = $html.IndexOf($Start)
  if ($s -lt 0) { throw "start not found" }
  $openStart = $html.LastIndexOf('<', $s)
  $mMain = [regex]::Match($html.Substring($openStart), '(?is)^(.*?)</main>')
  if ($mMain.Success) { $html = $mMain.Groups[1].Value } else { $html = $html.Substring($openStart) }
}

$void = @('br','hr','img','input','meta','link','source','area','base','col','embed','param','track','wbr')
$tokens = [regex]::Matches($html, '(?is)<(/?)([a-zA-Z0-9:-]+)((?:"[^"]*"|''[^'']*''|[^>""''])*?)(/?)>|([^<]+)')
$sb = New-Object System.Text.StringBuilder
$depth = 0
$stack = New-Object System.Collections.Stack

function Clean([string]$t) { return ($t -replace '\s+', ' ').Trim() }

foreach ($t in $tokens) {
  if ($t.Groups[6].Success) {
    $txt = Clean $t.Groups[6].Value
    if ($txt -ne '' -and $txt -ne '&nbsp;') {
      $max = 110
      if ($txt.Length -gt $max) { $txt = $txt.Substring(0,$max) + '...' }
      [void]$sb.AppendLine(('  ' * $depth) + '"' + $txt + '"')
    }
    continue
  }
  $close = $t.Groups[1].Value -eq '/'
  $tag = $t.Groups[2].Value.ToLower()
  $attrs = $t.Groups[3].Value
  $selfClose = $t.Groups[4].Value -eq '/'

  if ($close) {
    $depth = [Math]::Max(0, $depth - 1)
    continue
  }

  $id = ''
  $mi = [regex]::Match($attrs, '(?is)(?:^|\s)id=["'']([^"'']*)["'']')
  if ($mi.Success) { $id = '#' + $mi.Groups[1].Value }
  $cls = ''
  $mc = [regex]::Match($attrs, '(?is)(?:^|\s)class=["'']([^"'']*)["'']')
  if ($mc.Success) { $cls = '.' + (Clean $mc.Groups[1].Value).Replace(' ', '.') }

  $extra = ''
  if ($tag -eq 'a') {
    $mh = [regex]::Match($attrs, '(?is)(?:^|\s)href=["'']([^"'']*)["'']')
    if ($mh.Success) { $extra += ' href=' + $mh.Groups[1].Value }
  }
  if ($tag -eq 'img') {
    $ms = [regex]::Match($attrs, '(?is)(?:^|\s)src=["'']([^"'']*)["'']')
    if ($ms.Success) { $extra += ' src=' + ($ms.Groups[1].Value -replace '^https://b014\.wordsense\.kr','') }
    $ma = [regex]::Match($attrs, '(?is)(?:^|\s)alt=["'']([^"'']*)["'']')
    if ($ma.Success) { $extra += ' alt=' + $ma.Groups[1].Value }
  }
  if ($tag -eq 'svg') {
    $md = [regex]::Match($attrs, '(?is)(?:^|\s)data-name=["'']([^"'']*)["'']')
    if ($md.Success) { $extra += ' data-name=' + $md.Groups[1].Value }
  }
  if ($tag -match '^(h[1-6]|p|span|div|button|li|time)$') { }

  [void]$sb.AppendLine(('  ' * $depth) + '<' + $tag + '>' + $id + $cls + $extra)

  if ($void -contains $tag -or $selfClose) { continue }
  $depth++
}

[System.IO.File]::WriteAllText($Out, $sb.ToString(), [System.Text.UTF8Encoding]::new($false))
"WROTE $Out  lines=$((Get-Content $Out).Count)"
