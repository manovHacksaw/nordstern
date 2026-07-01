---
title: "Delete Customer Data | Stellar Docs"
source: "https://developers.stellar.org/docs/platforms/anchor-platform/api-reference/callbacks/del-customer"
author:
published: 2026-06-17
created: 2026-07-01
description: "The request for this endpoint is identical to the"
tags:
  - "clippings"
---
## Delete Customer Data

```markdown
DELETE https://callback.business-server.exampleanchor.com/customer/:id
```

The request for this endpoint is identical to the [`DELETE /customer`](https://github.com/stellar/stellar-protocol/blob/master/ecosystem/sep-0012.md#customer-delete) request defined in SEP-12.

Delete the customer's data or queue the customers data for deletion.

## Request

> [!-info] -info
> ### Path Parameters
> 
> **id** stringrequired

## Responses

Success.

- csharp
- curl
- dart
- go
- http
- java
- javascript
- kotlin
- c
- nodejs
- objective-c
- ocaml
- php
- postman-cli
- powershell
- python
- r
- ruby
- rust
- shell
- swift