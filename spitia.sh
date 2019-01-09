#!/bin/sh
URL="http://www.xe.gr/property/search?Geo.area_id_new__hierarchy=82487&Geo.area_id_new__hierarchy=82399&Geo.area_id_new__hierarchy=82339&Geo.area_id_new__hierarchy=82355&Geo.area_id_new__hierarchy=82356&Geo.area_id_new__hierarchy=82488&Geo.area_id_new__hierarchy=82358&Item.area.from=50&System.item_type=re_residence&Transaction.price.from=200&Transaction.price.to=400&Transaction.type_channel=117541&page=1&per_page=100"

curl -N "${URL}" | pup 'div.r json{}' | jq -r '[.[] as $house | {href: $house.children[0].href, location: $house.children[1].children[1].children[0].text, description: $house.children[1].children[1].text, price: $house.children[2].children[0].text, surface: $house.children[2].children[1].text, date: $house["data-edata"], id: $house["data-id"]}]' > /srv/houses/public/houses.json

/usr/bin/env node /srv/houses/pushbullet
