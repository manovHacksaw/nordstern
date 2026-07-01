---
title: "Retrieve a Transaction | Stellar Docs"
source: "https://developers.stellar.org/docs/platforms/anchor-platform/api-reference/platform/transactions/get-transaction"
author:
published: 2026-06-17
created: 2026-07-01
description: "Provides the information necessary for the business to determine the state of the transaction identified by `id`, decide if any action must be taken to continue processing the transaction, and act on the decision."
tags:
  - "clippings"
---
## Retrieve a Transaction

```markdown
GET https://platform-server.exampleanchor.com/transactions/:id
```

Provides the information necessary for the business to determine the state of the transaction identified by `id`, decide if any action must be taken to continue processing the transaction, and act on the decision.

## Request

> [!-info] -info
> ### Path Parameters
> 
> **id** stringrequired

## Responses

Transaction found.

- application/json

> [!-info] -info
> **Schema**
> 
> oneOf
> 
> **id** stringrequired
> 
> **sep** stringrequired
> 
> **Possible values:** \[`6`\]
> 
> **kind** stringrequired
> 
> **Possible values:** \[`deposit`, `deposit-exchange`, `withdrawal`, `withdrawal-exchange`\]
> 
> **status** StatusSEP6required
> 
> Possible status value for SEP-6 transactions
> 
> **Possible values:** \[`incomplete`, `completed`, `refunded`, `expired`, `error`, `pending_stellar`, `pending_external`, `pending_customer_info_update`, `pending_user_transfer_start`, `pending_user_transfer_complete`, `pending_anchor`, `pending_trust`, `pending_user`, `no_market`, `too_small`, `too_large`\]
> 
> **type** string
> 
> The method the user used to deposit or withdraw offchain funds.
> 
> > [!-info] -info
> > **amount\_expected** object
> 
> > [!-info] -info
> > **amount\_in** object
> 
> > [!-info] -info
> > **amount\_out** object
> 
> > [!-info] -info
> > **fee\_details** object
> 
> **quote\_id** string
> 
> **started\_at** date-timerequired
> 
> **updated\_at** date-time
> 
> **completed\_at** date-time
> 
> **transfer\_received\_at** date-time
> 
> **user\_action\_required\_by** date-time
> 
> **message** string
> 
> > [!-info] -info
> > **refunds** object
> 
> > [!-info] -info
> > **stellar\_transactions** object\[\]
> 
> **source\_account** string
> 
> **destination\_account** string
> 
> **external\_transaction\_id** string
> 
> **memo** string
> 
> **memo\_type** MemoType
> 
> The memo type of the transaction in the Stellar network. Should be present if memo is not null.
> 
> **Possible values:** \[`text id hash`\]
> 
> **refund\_memo** string
> 
> If provided, this memo should be used for refund transactions.
> 
> **refund\_memo\_type** MemoType
> 
> The memo type of the transaction in the Stellar network. Should be present if memo is not null.
> 
> **Possible values:** \[`text id hash`\]
> 
> **client\_domain** string
> 
> **client\_name** string
> 
> > [!-info] -info
> > **customers** object
> 
> > [!-info] -info
> > **creator** object

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