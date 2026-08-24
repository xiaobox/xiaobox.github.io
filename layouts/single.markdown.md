{{- /*
  Markdown 输出格式：为每篇单页产出干净的 /<...>/index.md 副本，
  供 AI 抓取器直接读取原始 Markdown，无需解析 HTML。
  独立模板（无 define 块），因此不会被 baseof.html 包裹。
*/ -}}
{{- $desc := .Description -}}
{{- if not $desc -}}{{- $desc = .Summary -}}{{- end -}}
{{- $desc = $desc | plainify | replaceRE "\\s+" " " | strings.TrimSpace -}}
---
title: {{ .Title | jsonify }}
{{ with $desc }}description: {{ . | jsonify }}
{{ end -}}
{{ if not .Date.IsZero }}date: {{ .Date.Format "2006-01-02T15:04:05Z07:00" }}
{{ end -}}
{{ if and (not .Lastmod.IsZero) (ne .Lastmod .Date) }}lastmod: {{ .Lastmod.Format "2006-01-02T15:04:05Z07:00" }}
{{ end -}}
canonical: {{ .Permalink }}
author: 小盒子
{{ with .Params.categories }}categories: [{{ range $i, $c := . }}{{ if $i }}, {{ end }}{{ $c | jsonify }}{{ end }}]
{{ end -}}
{{ with .Params.tags }}tags: [{{ range $i, $t := . }}{{ if $i }}, {{ end }}{{ $t | jsonify }}{{ end }}]
{{ end -}}
{{ with .Params.original_url }}source: {{ . }}
{{ end -}}
{{ if and .Site.Params.article.license.enabled (ne .Params.license false) }}license: CC BY-NC-SA 4.0
license_url: https://creativecommons.org/licenses/by-nc-sa/4.0/
{{ end -}}
---

# {{ .Title }}

{{ .RawContent }}
