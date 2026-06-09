---
title: "{{ replace .Name "-" " " | title }}"
weight: 10
year: {{ now.Year }}
cardColor: "#fff"
cover: "img-1.jpg"
description: ""
---

{{< gallery >}}
{{< img src="img-1.jpg" layout="full" >}}
{{< /gallery >}}
