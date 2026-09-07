#!/bin/sh
set -eu

enabled="${MAP_POIS_ENABLED:-true}"
case "$(echo "$enabled" | tr '[:upper:]' '[:lower:]')" in
  true|1|yes|on) map_pois_enabled=true ;;
  *) map_pois_enabled=false ;;
esac

cat > /usr/share/nginx/html/assets/runtime-config.json <<EOF
{"mapPoisEnabled":${map_pois_enabled}}
EOF

exec nginx -g 'daemon off;'
