T---
title: "Retrieve a List of Transactions"
source: "https://developers.stellar.org/docs/platforms/anchor-platform/api-reference/platform/transactions/get-transactions"
author:
published: 2026-06-17
created: 2026-07-01
description: "Allows to query list of transactions for desired SEP. This api supports pagination, and it's possible (and recommended) to make multiple requests to query transactions. The last page is reached when the number of elements returned by the endpoint is smaller than provided `page_size`."
tags:
  - "clippings"
---
```markdown
GET https://platform-server.exampleanchor.com/transactions
```

Allows to query list of transactions for desired SEP. This api supports pagination, and it's possible (and recommended) to make multiple requests to query transactions. The last page is reached when the number of elements returned by the endpoint is smaller than provided `page_size`.

## Request

> [!-info] -info
> ### Query Parameters
> 
> **sep** stringrequired
> 
> **Possible values:** \[`6`, `24`, `31`\]
> 
> Lookup transactions belonging to this SEP.
> 
> **order\_by** string
> 
> **Possible values:** \[`created_at`, `transfer_received_at`, `user_action_required_by`\]
> 
> Specifies field that transactions will be ordered by. Note, that secondary sort is transaction id in ascending value. I.e. when timestamps for 2 or more transactions is identical, they will be sorted by id.
> 
> **Default value:** `created_at`
> 
> **order** string
> 
> **Possible values:** \[`asc`, `desc`\]
> 
> Specifies order. Note, that when the field is null, all transactions with null value will be last, regardless of soring order (NULLS LAST). For example, transfer time may not be specified for some transactions, resulting into `transfer_received_at` being null. If so, transactions with non-null values will be sorted and returned first, followed by all transactions with null timestamps.
> 
> **Default value:** `asc`
> 
> **statuses** StatusSEPAll\[\]
> 
> **Possible values:** \[`incomplete`, `completed`, `refunded`, `expired`, `error`, `pending_stellar`, `pending_external`, `pending_user_transfer_start`, `pending_user_transfer_complete`, `pending_anchor`, `pending_trust`, `pending_user`, `no_market`, `too_small`, `too_large`, `pending_sender`, `pending_receiver`, `pending_transaction_info_update`, `pending_customer_info_update`\]
> 
> Filters transactions for specified array of statuses. If not provided, filtering is disabled (default behavior)
> 
> **page\_size** integer
> 
> Size of a single search page. Must be positive.
> 
> **Default value:** `20`
> 
> **page\_number** integer
> 
> Page number to use for continuous search. Page count beings at 0.
> 
> **Default value:** `0`

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