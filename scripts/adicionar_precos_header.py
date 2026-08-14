from pathlib import Path

p = Path('index.html')
s = p.read_text(encoding='utf-8')

old = '<a href="#cadastro" class="btn primary">Começar agora</a>'
new = '<a href="precos.html" class="btn gold header-precos">💶 Preços</a><a href="#cadastro" class="btn primary">Começar agora</a>'

if 'class="header-precos"' not in s:
    if old not in s:
        raise SystemExit('Cabeçalho esperado não encontrado.')
    s = s.replace(old, new, 1)

css_marker = '</style></head>'
css = '<style id="eurocompra-precos-header">.header-precos{white-space:nowrap}.nav{gap:8px}@media(max-width:850px){.nav{gap:6px}.header-precos{padding:10px 12px;font-size:13px}.nav>.primary{padding:10px 12px;font-size:13px}.logo{font-size:19px}.logo-icon{width:38px;height:38px;margin-right:6px}}@media(max-width:390px){.header-precos{padding:9px 10px;font-size:12px}.nav>.primary{padding:9px 10px;font-size:12px}.logo{font-size:18px}.logo-icon{width:36px;height:36px}}</style>'

if 'id="eurocompra-precos-header"' not in s:
    if css_marker not in s:
        raise SystemExit('Local de CSS esperado não encontrado.')
    s = s.replace(css_marker, css + css_marker, 1)

p.write_text(s, encoding='utf-8')
print('Cabeçalho de preços aplicado.')
