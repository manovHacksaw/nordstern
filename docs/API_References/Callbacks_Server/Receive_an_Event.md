---
title: "Receive an Event | Stellar Docs"
source: "https://developers.stellar.org/docs/platforms/anchor-platform/api-reference/callbacks/post-event"
author:
published: 2026-06-17
created: 2026-07-01
description: "Receive a JSON object representing an event."
tags:
  - "clippings"
---
## Receive an Event

```markdown
POST https://callback.business-server.exampleanchor.com/event
```

Receive a JSON object representing an event.

## Request

- application/json

> [!-info] -info
> ### Body
> 
> **id** stringrequired
> 
> **type** stringrequired
> 
> The transaction event type. Can be one of the following:
> 
> - `transaction_created` - a transaction was created through the SEP endpoints. The payload is in the `transaction` field.
> - `transaction_status_changed` - the status of a transaction has changed. The payload is in the `transaction` field.
> - `quote_created` - a quote was created via the SEP38 API. The payload is in the `quote` field.
> 
> **Possible values:** \[`transaction_created`, `transaction_status_changed`, `quote_created`, `customer_updated`\]
> 
> **timestamp** date-timerequired
> 
> > [!-info] -info
> > **payload** objectrequired

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

- HTTPCLIENT
- RESTSHARP