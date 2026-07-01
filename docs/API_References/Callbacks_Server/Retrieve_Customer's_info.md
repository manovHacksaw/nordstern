---
title: "Retrieve Customer's Info | Stellar Docs"
source: "https://developers.stellar.org/docs/platforms/anchor-platform/api-reference/callbacks/get-customer"
author:
published: 2026-06-17
created: 2026-07-01
description: "The request and response for this endpoint is identical to the"
tags:
  - "clippings"
---
## Retrieve Customer's Info

```markdown
GET https://callback.business-server.exampleanchor.com/customer
```

The request and response for this endpoint is identical to the [`GET /customer`](https://github.com/stellar/stellar-protocol/blob/master/ecosystem/sep-0012.md#customer-get) request and response defined in SEP-12.

This endpoint allows clients to:

1. Fetch the fields the server requires in order to register a new customer via a SEP-12 [`PUT /customer`](https://github.com/stellar/stellar-protocol/blob/master/ecosystem/sep-0012.md#customer-put) request

If the server does not have a customer registered for the parameters sent in the request, it should return the fields required in the response. The same response should be returned when no parameters are sent.

2. Check the status of a customer that may already be registered

This allows clients to check whether the customers information was accepted, rejected, or still needs more info. If the server still needs more info, or the server needs updated information, it should return the fields required.

## Request

> [!-info] -info
> ### Query Parameters
> 
> **id** string
> 
> The ID of the customer as returned in the response of a previous PUT request.
> 
> **account** string
> 
> The Stellar or Muxed Account authenticated with the Platform via SEP-10.
> 
> **memo** string
> 
> The memo value identifying a customer with a shared account, where the shared account is `account`.
> 
> **memo\_type** string
> 
> **Possible values:** \[`id`, `hash`, `text`\]
> 
> The type of memo used to identify a customer with a shared account.
> 
> **type** string
> 
> The type of action the customer is being KYCd for. See the [Type Specification](https://github.com/stellar/stellar-protocol/blob/master/ecosystem/sep-0012.md#type-specification) documented in SEP-12.
> 
> **transaction\_id** string
> 
> The transaction id with which the customer's info is associated. When information from the customer depends on the transaction (e.g., more information is required for larger amounts)
> 
> **lang** string
> 
> Defaults to `en`. Language code specified using ISO 639-1. Human readable descriptions, choices, and messages should be in this language.

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